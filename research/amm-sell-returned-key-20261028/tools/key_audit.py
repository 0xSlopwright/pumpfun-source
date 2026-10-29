"""Bind the source getter correction to the original local constructor-return key chain."""
from pathlib import Path
import hashlib
import struct
from cfg_attribution import Inventory


def audit(original_path,control_path,candidate_path):
    images={'original':Inventory(Path(original_path),True),'control':Inventory(Path(control_path)),'candidate':Inventory(Path(candidate_path))}
    records={}
    for kind,e in images.items():
        f={'start':0x4c750,'size':9024} if kind=='original' else next(f for f in e.functions.values() if '4sell8cashback' in f['name'] and f['size']>500)
        start=f['start'];coff=0x17a0 if kind=='original' else 0x1798
        target=next(c['target'] for c in e.function(start)['calls'] if c['offset']==coff)
        constructor=e.function(target)
        def insn(at):
            raw=e.elf.b[at:at+8]
            return {'value':raw.hex(),'decoded':list(struct.unpack('<BBhi',raw))}
        # Constructor incoming ABI: r1=sret, r2=AccountInfo input. Its success
        # path stores that exact input at return+0; all three actual checked
        # constructor bodies and depth-two outgoing identities are equal.
        a,b,z=[insn(target+off) for off in [0,8,0x3d8]]
        assert a['decoded']==[0xbf,0x27,0,0] and b['decoded']==[0xbf,0x16,0,0]
        assert z['decoded']==[0x7b,0x76,0,0]
        setup=[insn(start+coff+off) for off in [-24,-16,-8]]
        assert setup[0]['decoded']==[0xbf,0xa1,0,0]
        assert setup[1]['decoded']==[0x07,1,0,-0x2b0]
        assert setup[2]['decoded']==[0xbf,0x72,0,0]
        roff=0x17b0 if kind=='original' else 0x17a8
        returned=insn(start+roff)
        register=returned['decoded'][1]&15
        assert returned['decoded']==[0x79,0xa0|register,-0x2b0,0]
        koff=0x1830 if kind=='original' else 0x1828
        key=insn(start+koff)
        through_return=kind!='control'
        if through_return:
            assert key['decoded']==[0x79,(register<<4)|1,0,0]
        else:
            assert key['decoded']==[0x79,0xa2,-0x578,0]
        # Register holding returned AccountInfo remains untouched until the key
        # load. Calls preserve r6..r9 by the SBF ABI; this record does not prove
        # equivalence of the rest of the function's differently allocated regs.
        assert register in range(6,10)
        clobbers=[]
        for off in range(roff+8,koff,8):
            op,regs,d,imm=struct.unpack_from('<BBhi',e.elf.b,start+off)
            writes=(op==0x18 or op&7 in (1,4,7))
            if writes and regs&15==register:clobbers.append(hex(off))
        assert not clobbers
        records[kind]={'parent_start':hex(start),'constructor_call_offset':hex(coff),'actual_constructor':hex(target),
                       'constructor_bytes':constructor['bytes'],'constructor_depth2_identity':e.tag(target,2),
                       'constructor_input_copy':a,'constructor_sret_copy':b,'constructor_success_store_offset':'0x3d8','constructor_success_store':z,
                       'caller_setup':setup,'caller_return_load_offset':hex(roff),'caller_return_load':returned,
                       'returned_info_register':register,'key_load_offset':hex(koff),'key_load':key,
                       'key_derived_through_returned_account':through_return,'return_register_clobbers_before_key_load':clobbers}
    assert records['original']['constructor_depth2_identity']==records['control']['constructor_depth2_identity']==records['candidate']['constructor_depth2_identity']
    return {'scope':__doc__,'official_sell_status':'UNEQUAL','images':{k:hashlib.sha256(e.elf.b).hexdigest() for k,e in images.items()},
            'records':records,'limitation':'Local return/key dataflow only. This is not a whole-function register-value, raw-byte, exhaustive-behavior or security proof.'}
