#!/usr/bin/env python3
"""Verify retained costs evidence. No compiler or VM execution is performed.
Requires Python 3 and solders (CI pins 0.27.1). Only temporary files are written.
This verifies packet consistency and signatures, not execution attestation.
"""
import argparse, base64, difflib, gzip, hashlib, importlib, json, re, struct
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
    require([i+1 for i, (x,y) in enumerate(zip(old_bytes,new_bytes)) if x != y] == [366,376],
            "expected only source lines 366 and 376")
    old, new = ([line.rstrip(b"\r\n") for line in lines] for lines in (old_bytes,new_bytes))
    expected = {
        366: (
            "let (buyback,post_buyback)=if is_mayhem==0{(crate::protocol_fee_split(buyback_bps,protocol_fee,is_mayhem!=0).0,match post{Some(p)=>crate::protocol_fee_split(buyback_bps,p.fees.protocol_fee,is_mayhem!=0).0,None=>0})}else{(0,0)};",
            "let buyback=crate::protocol_fee_split(buyback_bps,protocol_fee,is_mayhem!=0).0; let post_buyback=match post{Some(p)=>crate::protocol_fee_split(buyback_bps,p.fees.protocol_fee,is_mayhem!=0).0,None=>0};"),
        376: (
            "let (pool_quote,quote_transfer_fee)=gross_up_quote(quote_fee,net)?; Ok((pool_quote,total_buyback,quote_transfer_fee))",
            "let pool_quote=crate::transfer_fee_recovered::pre_fee_amount(quote_fee,net)?; let quote_transfer_fee=pool_quote.checked_sub(net).ok_or_else(gross_up_quote_error)?; Ok((pool_quote,total_buyback,quote_transfer_fee))")
    }
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
        require(isinstance(command,list) and all(x in command for x in
                ("build","--release","--offline","--locked","-vv")), "build flags differ")
        require(command[command.index("--target")+1] == "sbpf-solana-solana", "build target differs")
        record = (launch["tools"],launch["controller_sha256"])
        require(record[0] and re.fullmatch("[0-9a-f]{64}",record[1]), "build provenance missing")
        require(provenance is None or record == provenance, "build tool/controller hashes differ")
        provenance = record
    require(images["candidate"] == images["repeat"], "repeat ELF bytes differ")
    return images

def binary(packet, repo, images, temp):
    sys.path.insert(0,str(packet/"tools"))
    census = importlib.import_module("census")
    census.ROOT = repo
    original = (repo/"evidence/original/pump/deployed.so").read_bytes()
    require(sha(original) == ORIGINAL_SHA, "original ELF hash differs")
    os_ = census.sections(original)
    on,_ = census.normalize(census.body(original,os_,0x80df8,2120),0x80df8,os_)
    memberships, stats = [], {}
    counts = dict(total=1035,normalized=1019,raw=183,unmatched=16,matched_text_bytes=1611088)
    for label, size, difference in (("parent",2056,70),("candidate",2144,25)):
        blob = images[label]["symbols"]
        path = temp/(label+".so")
        path.write_bytes(blob)
        sections = census.sections(blob)
        matches = [f for f in census.functions(blob) if "5trade12v3_buy_costs17h" in f[2]]
        require(len(matches)==1, "costs symbol not unique")
        address,length,name = matches[0]
        require(length == size, "costs function length differs")
        norm, operands = census.normalize(census.body(blob,sections,address,length),address,sections)
        slots = lambda v:[v[i:i+8] for i in range(0,len(v),8)]
        changes = [x for x in difflib.SequenceMatcher(None,slots(on),slots(norm),autojunk=False).get_opcodes()
                   if x[0] != "equal"]
        aligned = sum(max(j-i,l-k) for _,i,j,k,l in changes)
        require(aligned == difference and on != norm, "target narrow aligned diagnostic differs")
        full = census.census(path)
        require(full == doc(packet/"build"/label/"costs-census.json.gz"), "full saved census differs")
        require(full["counts"] == counts, "census counts differ")
        membership = {w["start"]:(bool(w["normalized_matches"]),w["raw_match"]) for w in full["windows"]}
        require(membership[0x80df8] == (False,False), "unmatched target received credit")
        memberships.append(membership)
        actual = dict(original_address="0x80df8",original_bytes=2120,candidate_address=hex(address),
                      candidate_bytes=length,symbol=name,image_sha256=sha(blob),
                      target_normalized_sha256=sha(norm),whole_target_equal=False,
                      aligned_differing_slots_diagnostic=aligned,counts=counts,
                      direct_calls=sum(x["kind"]=="direct-call" for x in operands),
                      alignment_changes=[dict(kind=t,original=[i,j],candidate=[k,l]) for t,i,j,k,l in changes])
        saved = doc(packet/"build"/label/"costs-measurement.json")
        require(all(saved[k] == v for k,v in actual.items()), "saved target measurement differs")
        if label=="candidate":
            require(saved["membership_changes"] == {}, "saved membership changes differ")
        stripped = images[label]["candidate"]
        ss = census.sections(stripped)
        for section in (".text",".rodata",".data.rel.ro"):
            a,b = sections[section],ss[section]
            require(a["addr"]==b["addr"] and blob[a["offset"]:a["offset"]+a["size"]]
                    == stripped[b["offset"]:b["offset"]+b["size"]], "stripped section differs")
        stats[label] = {"bytes":length,"aligned_differing_8byte_slots":aligned}
    require(memberships[0] == memberships[1], "normalized/raw window membership differs")
    return {"original_bytes":2120,**stats,"counts":counts,"whole_target_equal":False}

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
    six,twenty,receipt = (doc(packet/"runtime"/name) for name in
                         ("costs-six.json.gz","costs20.json.gz","costs20-loader.json"))
    require(len(six["cases"])==6 and len(twenty["cases"])==twenty["case_count"]==20, "runtime case count differs")
    require(six["binary_sha256"] == dict(original=hashes["original"],parent=hashes["parent"],
                                       proposal=hashes["candidate"]), "six image identities differ")
    require(all(twenty[k]==hashes[v] for k,v in
                (("original_sha256","original"),("control_sha256","parent"),("candidate_sha256","candidate"))),
            "twenty image identities differ")
    meter = re.compile(r"^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$")
    clean = lambda r:[s for s in r["logs"] if not meter.fullmatch(s)]
    fields = {"error","accounts","inner_instructions","event_payloads","logs",
              "transaction_base64","signature_verified","return_data"}
    signatures=successes=0
    loader_records=[]
    for family,records in (("six",six["cases"]),("twenty",twenty["cases"])):
        for i,row in enumerate(records):
            runs = ({k:row["runs"][v] for k,v in
                     (("original","original"),("parent","parent"),("candidate","proposal"))}
                    if family=="six" else {k:row[v] for k,v in
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
            if family=="six":
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
                require(row["proposal_differences"]==row["parent_differences"]==[],
                        "six saved difference summaries disagree")
            else:
                require(all(row[k] is True for k in ("candidate_semantic_equal",
                        "candidate_ordered_logs_equal_except_compute","control_semantic_equal",
                        "control_ordered_logs_equal_except_compute")), "twenty saved parity differs")
    require(signatures==78 and not twenty["candidate_semantic_mismatches"]
            and not twenty["candidate_log_mismatches"], "runtime signature/summary count differs")
    labels=["original"]+["original","candidate","parent"]*20
    require(len(receipt["loads"])==len(labels), "twenty loader count differs")
    loader_records.extend(zip(receipt["loads"],labels))
    for receipt_,label in loader_records:
        receipt_=dict(receipt_)
        require(isinstance(receipt_.pop("input_path"),str), "missing historical input label")
        require(receipt_==loads[label], "loader hash/content join differs")
    return dict(case_triples=26,executions=78,verified_signatures=signatures,
                original_successes=successes,loader_records=len(loader_records),
                additional_fixture_initialization_loads=1,structured_or_ordered_log_mismatches=0)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root",type=Path,required=True)
    args=parser.parse_args()
    packet,repo=Path(__file__).resolve().parent,args.repo_root.resolve()
    files=manifest(packet)
    inputs=sources(packet)
    images=builds(packet,inputs)
    with tempfile.TemporaryDirectory(prefix="pump-costs-verify-") as temporary:
        binary_report=binary(packet,repo,images,Path(temporary))
    runtime_report=runtime(packet,repo,images)
    print(json.dumps(dict(verified=True,
        scope="Retained evidence consistency and signatures; no compilation, VM replay or execution attestation.",
        manifest_files=files,source_files=66,changed_source_lines=[366,376],build_records=3,
        repeat_raw_images_equal=True,binary=binary_report,runtime=runtime_report),indent=2))

if __name__=="__main__":
    main()
