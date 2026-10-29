"""Verify the unselected scanner dispatch trial and exact current CFG residual."""
from pathlib import Path,PurePosixPath
import hashlib,json,struct,sys
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W))
import map_cfg
from elf_reader import Elf
from object_sections import sections
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def j(p):return json.loads(Path(p).read_text())
def verify(root=None):
    w=Path(__file__).resolve().parent;m=j(w/'manifest.json')
    assert set(m['files'])|{'manifest.json'}=={p.relative_to(w).as_posix()for p in w.rglob('*')if p.is_file()and'__pycache__'not in p.parts}
    for name,digest in m['files'].items():
        p=PurePosixPath(name);assert not p.is_absolute()and'..'not in p.parts
        assert h(w/name)==digest
    assert h(w/'base-proposal-manifest.json')=='051562480e4b20141fe91a50bcfa8b498f71160e1b217bc4de8673e10050cc34'
    assert j(w/'base-proposal-manifest.json')['files']['objects/native_bool.rs']==h(w/'inputs/outlined-bool.rs')
    computed={name:map_cfg.cfg(code)for name,code in [('original',map_cfg.base),('outlined_bool',map_cfg.current),('dispatch_trial',map_cfg.trial)]}
    assert computed==j(w/'cfg.json')
    assert [(r['bytes'],r['instructions'],r['reachable'],len(r['blocks']))for r in computed.values()]==[(1192,149,149,65),(1168,146,146,66),(1408,176,176,73)]
    delta={k:computed['original']['opcode_counts'].get(k,0)-computed['outlined_bool']['opcode_counts'].get(k,0)for k in set(computed['original']['opcode_counts'])|set(computed['outlined_bool']['opcode_counts'])}
    assert delta['0xb7']==delta['0x6f']==delta['0x5']==1
    for op in ['0x79','0x7b','0x69','0x71']:assert delta[op]==0
    original=Elf(w/'inputs/original.so');a=0xf28b8
    def instruction(at):return struct.unpack_from('<BBhi',original.b,at)
    # Both bit computations and all masks use 64-bit ALU opcodes. A source u32
    # remains possible after range analysis, but is not identified by these bytes.
    assert instruction(0xf2a58)[0]==instruction(0xf2aa8)[0]==0x6f
    assert instruction(0xf2a68)[0]==instruction(0xf2a78)[0]==0x57
    assert instruction(0xf2ac0)[0]==0x5f
    assert instruction(0xf29b0)[0]==0x4f
    assert instruction(0xf2a40)[0]==0x2d and instruction(0xf2a48)==(0x25,9,-12,26)
    assert not original.callsites(a,1192)
    build=j(w/'dispatch-build.json');assert build['returncode']==0 and build['source_sha256']==h(w/'objects/native_dispatch.rs')
    context=Elf(w/'inputs/context.so');symbols=Elf(w/'inputs/context-symbols.so')
    assert h(context.path)=='e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615'
    wrapper=next(f for f in symbols.funcs if '5token14supported_mint17'in f['name'])
    scanner=next(f for f in symbols.funcs if '19supported_mint_data17'in f['name'])
    assert wrapper['size']==568 and context.normalized[wrapper['start']:wrapper['start']+568]==original.normalized[0x73ef0:0x74128]
    assert scanner['size']==1168 and context.normalized[scanner['start']:scanner['start']+1168]==map_cfg.current
    assert scanner['size']!=1192
    return {'passed':True,'context_sha256':h(context.path),'wrapper_normalized_equal':True,
        'scanner_original_bytes':1192,'scanner_current_bytes':1168,'unselected_dispatch_bytes':1408,
        'original_blocks':65,'current_blocks':66,'all_instructions_reachable':True,
        'load_store_count_delta':0,'extra_original_ops':['mov_imm','shift_left_reg_64','jump'],
        'u32_policy_type_identified':False,'u64_policy_type_identified':False,
        'new_production_patch':False,'compiler_or_vm_executed_by_verifier':False,
        'manifest_sha256':h(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
