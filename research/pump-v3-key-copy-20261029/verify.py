#!/usr/bin/env python3
"""Verify retained V3 key-copy evidence. No compiler or VM execution is performed.
Requires Python 3 and solders (CI pins 0.27.1). Only temporary files are written.
This verifies packet consistency and signatures, not execution attestation.
"""
if not __debug__:
    raise SystemExit("Run without -O")

import argparse, base64, difflib, gzip, hashlib, importlib, importlib.util, json, re, struct
import sys, tarfile, tempfile
from pathlib import Path, PurePosixPath
sys.dont_write_bytecode = True
ORIGINAL_SHA = "7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d"
SOURCE_PATH = "programs/pump/src/trade_v3.rs"
LABELS = ("parent", "candidate", "repeat")

def require(ok, message):
    if not ok:
        raise AssertionError(message)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def read(path):
    data = path.read_bytes()
    return gzip.decompress(data) if path.suffix == ".gz" else data

def doc(path):
    return json.loads(read(path))

def relative(name):
    p = PurePosixPath(name)
    require(p.parts and not p.is_absolute() and ".." not in p.parts and "\\" not in name,
            "unsafe relative path: " + name)
    return p.as_posix()

def manifest(packet):
    recorded = doc(packet / "MANIFEST.json")
    actual = {}
    for path in packet.rglob("*"):
        require(not path.is_symlink(), "packet contains symlink")
        if path.is_file() and path.relative_to(packet).as_posix() != "MANIFEST.json":
            actual[path.relative_to(packet).as_posix()] = sha(path.read_bytes())
    require(isinstance(recorded, dict) and recorded == actual, "MANIFEST hash/membership differs")
    for name in recorded:
        relative(name)
    return len(actual)

def archive(path):
    out = {}
    with tarfile.open(path, "r:gz") as tf:
        for member in tf:
            name = relative(member.name)
            if member.isdir():
                continue
            require(member.isfile() and name not in out, "non-regular/duplicate archive member")
            out[name] = tf.extractfile(member).read()
    return out

def sources(packet):
    a, b = (archive(packet / ("source-" + name + ".tar.gz")) for name in LABELS[:2])
    require(len(a) == len(b) == 66 and a.keys() == b.keys(), "workspace archive membership differs")
    require([k for k in a if a[k] != b[k]] == [SOURCE_PATH], "unexpected changed source file")
    old_bytes, new_bytes = (v[SOURCE_PATH].splitlines(keepends=True) for v in (a,b))
    require(len(old_bytes) == len(new_bytes), "source line count differs")
    require([i+1 for i, (x,y) in enumerate(zip(old_bytes,new_bytes)) if x != y] == [701],
            "expected only source line 701")
    old, new = ([line.rstrip(b"\r\n") for line in lines] for lines in (old_bytes,new_bytes))
    expected = {701: (
        "if a.user_volume_accumulator.user==Pubkey::default(){a.user_volume_accumulator.user=a.user.key();}",
        "if a.user_volume_accumulator.user==Pubkey::default(){a.user_volume_accumulator.user.as_mut().copy_from_slice(a.user.key.as_ref());}")}
    for line, pair in expected.items():
        require((old[line-1].strip().decode(),new[line-1].strip().decode()) == pair,
                "unexpected source at line " + str(line))
    for label, files in zip(LABELS[:2], (a,b)):
        require((packet/"source"/label/"trade_v3.rs").read_bytes() == files[SOURCE_PATH],
                "displayed source differs: " + label)
    expected_patch = "".join(difflib.unified_diff(
        a[SOURCE_PATH].decode().splitlines(keepends=True),
        b[SOURCE_PATH].decode().splitlines(keepends=True),
        fromfile="a/"+SOURCE_PATH,tofile="b/"+SOURCE_PATH))
    require((packet/"source.patch").read_text(encoding="utf-8") == expected_patch,
            "source.patch differs from exact archive diff")
    return {label:{k:sha(v) for k,v in files.items()} for label,files in zip(LABELS[:2],(a,b))}

def builds(packet, inputs):
    images, provenance = {}, None
    commands={'parent': '80068c3dc8463cd1c439c08c539d763e6be773fd8f23135358bf1da28e498477', 'candidate': 'd95d06b7af344b97962af6d6379895103f8361a86d35d47140c2e0fd7c830830', 'repeat': 'fd823d7dda89429441fcf4d0acf8174639101f4b1c80c4f9ac30fbb3dd98f2ab'}
    for label in LABELS:
        folder = packet/"build"/label
        launch, result = doc(folder/"launch.json"), doc(folder/"result.json")
        require(launch["inputs"] == inputs["parent" if label=="parent" else "candidate"],
                "build source hash join differs: " + label)
        require(result["returncode"] == 0 and result["inputs_unchanged"] is True
                and result["actual_root_compilations"] == 1, "unsuccessful build record: " + label)
        log = read(folder/"build.log.gz").decode()
        require(sum(s.strip().startswith("Running ") and "--crate-name pump_recovered " in s
                    for s in log.splitlines()) == 1, "root compilation log count differs: " + label)
        images[label] = {kind:read(folder/(kind+".so.gz")) for kind in ("symbols","candidate")}
        for kind,data in images[label].items():
            require(sha(data) == result[kind+"_sha256"], "ELF/build result hash differs: " + label)
        command = launch["command"]
        require(sha(json.dumps(command,sort_keys=True,separators=(",",":")).encode())==commands[label],"reviewed literal Cargo command differs")
        require(launch["controller_sha256"]=="771d9295ee6e8997546b2f0cde677213f23d9d31528a6df33293b9a284911eea","executed controller identity")
        require(isinstance(command,list) and all(x in command for x in
                ("build","--release","--offline","--locked","-vv")), "build flags differ")
        require(command[command.index("--target")+1] == "sbpf-solana-solana", "build target differs")
        require(launch["controller_sha256"]==sha((packet/"controllers/local_build.py").read_bytes()), "actual executed build controller")
        require(launch["tools"]=={'rustc': 'c8807b7ebede8578ac5a257ea333780f9d89bd356064fd8184af7e996cb71a97', 'cargo': 'd28444578306fe5a4f40524331411340123004e9e6556322fcabdbe351fe265d', 'objcopy': 'f078d5b1f9df4190e67938a13e81e1dda1057e16228ff1a6f2f5d5540c9e6aaf'},"qualified v1.44 tool hashes differ")
        record = (launch["tools"],launch["controller_sha256"])
        require(record[0] and re.fullmatch("[0-9a-f]{64}",record[1]), "build provenance missing")
        require(provenance is None or record == provenance, "build tool/controller hashes differ")
        provenance = record
    require(images["candidate"] == images["repeat"], "repeat ELF bytes differ")
    return images

def binary(packet, repo, images, temp):
    sys.path.insert(0,str(packet/"tools"))
    census=importlib.import_module("census");census.ROOT=repo
    original=(repo/"evidence/original/pump/deployed.so").read_bytes()
    require(sha(original)==ORIGINAL_SHA,"original ELF hash differs")
    os_=census.sections(original); original_raw=census.body(original,os_,0x83c00,3440)
    on,_=census.normalize(original_raw,0x83c00,os_)
    counts=dict(total=1035,normalized=1019,raw=183,unmatched=16,matched_text_bytes=1611088)
    memberships=[]; stats={};raws={}
    for label,difference in (("parent",126),("candidate",118)):
        blob=images[label]["symbols"];path=temp/(label+".so");path.write_bytes(blob)
        sec=census.sections(blob)
        fs=[f for f in census.functions(blob) if "5trade14v3_execute_buy17h" in f[2]]
        require(len(fs)==1,"execute symbol not unique")
        addr,size,name=fs[0];require(size==3408,"target length differs")
        raw=census.body(blob,sec,addr,size);raws[label]=raw;norm,refs=census.normalize(raw,addr,sec)
        slots=lambda v:[v[i:i+8] for i in range(0,len(v),8)]
        changes=[x for x in difflib.SequenceMatcher(None,slots(on),slots(norm),autojunk=False).get_opcodes() if x[0]!="equal"]
        aligned=sum(max(j-i,l-k) for _,i,j,k,l in changes)
        require(aligned==difference and on!=norm,"target alignment diagnostic differs")
        full=census.census(path)
        require(full==doc(packet/"build"/label/"census.json.gz"),"saved census differs")
        require(full["counts"]==counts,"census counts differ")
        membership={w["start"]:(bool(w["normalized_matches"]),w["raw_match"]) for w in full["windows"]}
        require(membership[0x83c00]==(False,False),"unmatched target received credit")
        memberships.append(membership)
        stripped=images[label]["candidate"];ss=census.sections(stripped)
        for sn in (".text",".rodata",".data.rel.ro"):
            a,b=sec[sn],ss[sn]
            require(a["addr"]==b["addr"] and blob[a["offset"]:a["offset"]+a["size"]]==stripped[b["offset"]:b["offset"]+b["size"]],"stripped section differs")
        stats[label]=dict(address=hex(addr),bytes=size,aligned_differing_8byte_slots=aligned)
    require(memberships[0]==memberships[1],"full window membership differs")
    changed=[i//8 for i in range(0,len(raws["parent"]),8) if raws["parent"][i:i+8]!=raws["candidate"][i:i+8]]
    require(changed==list(range(130,138)),"raw target change extends beyond eight copy slots")
    require(raws["candidate"][130*8:138*8]==original_raw[133*8:141*8],"copy block not raw-equal to original")
    return dict(original_bytes=3440,**stats,counts=counts,whole_target_equal=False,raw_changed_slots=changed,
                candidate_copy_raw_equal_original=True,original_copy_slots=[133,141],candidate_copy_slots=[130,138])


def runtime(packet,repo,images):
    from solders.transaction import Transaction
    from solders.pubkey import Pubkey
    folder = repo/"evidence/original/pump"
    capture = doc(folder/"capture.json")
    original = (folder/"deployed.so").read_bytes()
    program = (folder/"program-account.bin").read_bytes()
    pd = (folder/"programdata-account.bin").read_bytes()
    require(sha(original)==ORIGINAL_SHA and pd[45:]==original
            and sha(pd)==capture["programdata_sha256"] and sha(original)==capture["payload_sha256"],
            "captured ProgramData/payload hash join differs")
    require(len(program)==36 and program[4:]==bytes(Pubkey.from_string(capture["programdata"])),
            "captured Program account differs")
    header = pd[:45]
    require(len(original)==capture["payload_bytes"], "captured allocation length differs")
    raw = {"original":original,**{k:images[k]["candidate"] for k in LABELS[:2]}}
    hashes = {k:sha(v) for k,v in raw.items()}
    loads = {}
    for label,value in raw.items():
        require(len(value)<=len(original), "ELF exceeds captured allocation")
        allocated = header+value+bytes(len(original)-len(value))
        loads[label] = dict(elf_sha256=sha(value),elf_bytes=len(value),program_owner=capture["owner"],
            program_bytes=len(program),program_sha256=sha(program),programdata_bytes=len(allocated),
            programdata_sha256=sha(allocated),header_sha256=sha(header),elf_prefix_unchanged=True,
            zero_allocation_tail=True,slot=struct.unpack_from("<Q",header,4)[0]+1)
    copy=doc(packet/"runtime/copy-two.json.gz")
    require(len(copy["cases"])==2,"copy case count differs")
    six,twenty,receipt = (doc(packet/"runtime"/name) for name in
                         ("costs-six.json.gz","costs20.json.gz","costs20-loader.json"))
    require(len(six["cases"])==6 and len(twenty["cases"])==twenty["case_count"]==20, "runtime case count differs")
    require(six["binary_sha256"] == dict(original=hashes["original"],parent=hashes["parent"],
                                       proposal=hashes["candidate"]), "six image identities differ")
    require(all(twenty[k]==hashes[v] for k,v in
                (("original_sha256","original"),("control_sha256","parent"),("candidate_sha256","candidate"))),
            "twenty image identities differ")
    require(copy["binary_sha256"]==six["binary_sha256"],"copy image identity differs")
    execute=doc(packet/"runtime/execution.json")
    require([x["returncode"] for x in execute["results"]]==[0,0,0] and all(execute["inputs_unchanged"].values()),"runtime executions or input preservation failed")
    fixture=doc(repo/"research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json")
    volume=fixture["accounts"]["volume"]
    copy_checks=[]
    meter = re.compile(r"^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$")
    clean = lambda r:[s for s in r["logs"] if not meter.fullmatch(s)]
    fields = {"error","accounts","inner_instructions","event_payloads","logs",
              "transaction_base64","signature_verified","return_data"}
    signatures=successes=0
    loader_records=[]
    for family,records in (("copy",copy["cases"]),("six",six["cases"]),("twenty",twenty["cases"])):
        for i,row in enumerate(records):
            runs = ({k:row["runs"][v] for k,v in
                     (("original","original"),("parent","parent"),("candidate","proposal"))}
                    if family in ("copy","six") else {k:row[v] for k,v in
                     (("original","original"),("parent","control"),("candidate","candidate"))})
            baseline=runs["original"]
            successes += baseline["error"] is None
            for label,result in runs.items():
                require(set(result)==fields, "unexpected runtime result fields")
                require(result["signature_verified"] is True, "false retained signature flag")
                wire=base64.b64decode(result["transaction_base64"],validate=True)
                tx=Transaction.from_bytes(wire)
                require(bytes(tx)==wire and len(tx.signatures)==tx.message.header.num_required_signatures>0,
                        "transaction encoding/signature count differs")
                tx.verify()
                signatures+=len(tx.signatures)
                require({k:v for k,v in result.items() if k!="logs"}
                        == {k:v for k,v in baseline.items() if k!="logs"} and clean(result)==clean(baseline),
                        "structured or ordered log difference: "+family+"/"+str(i)+"/"+label)
                for account in result["accounts"].values():
                    if account["data_hex"] is not None:
                        require(sha(bytes.fromhex(account["data_hex"]))==account["data_sha256"],
                                "retained account data/hash differs")
            if family in ("copy","six"):
                observations=row["observations"]
                for label,alias in (("original","original"),("parent","parent"),("candidate","proposal")):
                    observation=observations[alias]
                    require(observation["transaction_base64"]==runs[label]["transaction_base64"]
                            and observation["signatures_valid"] is True, "observed signed wire differs")
                    require(observation["before"]==observations["original"]["before"]
                            and observation["after"]==observations["original"]["after"],
                            "focused exact pre/post state differs")
                    require(len(observation["loaded_programs"])==1,"focused Pump load count differs")
                    loader_records.append((observation["loaded_programs"][0],label))
                    if family=="copy":
                        result=runs[label];tx=Transaction.from_bytes(base64.b64decode(result["transaction_base64"]))
                        signer=bytes(tx.message.account_keys[0]);initial=bytes(32) if row["case"]["initial_user"]=="zero" else signer
                        require(result["error"] is None,"copy control did not succeed")
                        require(observation["before"][volume]["volume_user_hex"]==initial.hex(),"copy pre-state differs")
                        require(observation["after"][volume]["volume_user_hex"]==signer.hex(),"copy post-state not signer")
                        account=result["accounts"][volume]
                        require(bytes.fromhex(account["data_hex"])[8:40]==signer,"actual retained account user not signer")
                        require(observation["after"][volume]["data_sha256"]==account["data_sha256"],"copy observer/account hash differs")
                        copy_checks.append(dict(case=row["case"]["label"],image=label,initial_user_hex=initial.hex(),post_user_hex=signer.hex()))
                require(row["proposal_differences"]==row["parent_differences"]==[],
                        "six saved difference summaries disagree")
            else:
                require(all(row[k] is True for k in ("candidate_semantic_equal",
                        "candidate_ordered_logs_equal_except_compute","control_semantic_equal",
                        "control_ordered_logs_equal_except_compute")), "twenty saved parity differs")
    require(signatures==84 and not twenty["candidate_semantic_mismatches"]
            and not twenty["candidate_log_mismatches"], "runtime signature/summary count differs")
    labels=["original"]+["original","candidate","parent"]*20
    require(len(receipt["loads"])==len(labels), "twenty loader count differs")
    loader_records.extend(zip(receipt["loads"],labels))
    for receipt_,label in loader_records:
        receipt_=dict(receipt_)
        require(isinstance(receipt_.pop("input_path"),str), "missing historical input label")
        require(receipt_==loads[label], "loader hash/content join differs")
    return dict(case_triples=28,executions=84,verified_signatures=signatures,
                original_successes=successes,loader_records=len(loader_records),
                additional_fixture_initialization_loads=1,structured_or_ordered_log_mismatches=0,copy_branch_successes=copy_checks)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root",type=Path,required=True)
    args=parser.parse_args()
    packet,repo=Path(__file__).resolve().parent,args.repo_root.resolve()
    files=manifest(packet)
    inputs=sources(packet)
    images=builds(packet,inputs)
    spec=importlib.util.spec_from_file_location("key_copy_saved_correspondence",packet/"correspondence.py")
    correspondence=importlib.util.module_from_spec(spec);spec.loader.exec_module(correspondence)
    correspondence.source_parent(inputs)
    for label in LABELS[:2]:
        require(inputs[label]==doc(packet/("source-"+label+".json")),"source map/archive join")
    with tempfile.TemporaryDirectory(prefix="pump-execute-key-verify-") as temporary:
        binary_report=binary(packet,repo,images,Path(temporary))
    runtime_report=runtime(packet,repo,images)
    runtime_report["correspondence"]=correspondence.verify(packet,repo,images,read,doc)
    print(json.dumps(dict(verified=True,
        scope="Retained evidence consistency and signatures; no compilation, VM replay or execution attestation.",
        manifest_files=files,source_files=66,changed_source_lines=[701],build_records=3,
        repeat_raw_images_equal=True,binary=binary_report,runtime=runtime_report),indent=2))

if __name__=="__main__":
    main()
