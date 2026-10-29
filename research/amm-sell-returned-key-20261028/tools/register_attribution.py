"""Read-only register-renaming constraints; no rewrite or value-equivalence proof."""
import argparse,gzip,json,struct,hashlib
from pathlib import Path


def operands(op,regs):
    cls=op&7
    if op==0 or op in (0x05,0x85,0x95):return []
    if op==0x18:return [('dst',regs&15)]
    if cls in (1,3):return [('dst',regs&15),('src',regs>>4)]
    if cls==2:return [('dst',regs&15)]
    if cls in (4,7,5,6):return [('dst',regs&15)]+([('src',regs>>4)] if op&8 else [])
    raise ValueError(hex(op))


def check(rows):
    forward,reverse,witness,back={},{},{},{}
    conflicts=[]
    for x in rows:
        a,b=x['candidate_register'],x['original_register']
        if a in forward and forward[a]!=b:conflicts.append({'reason':'one candidate register needs two original registers','previous':witness[a],'next':x})
        if b in reverse and reverse[b]!=a:conflicts.append({'reason':'two candidate registers need one original register','previous':back[b],'next':x})
        if a not in forward:forward[a]=b;witness[a]=x
        if b not in reverse:reverse[b]=a;back[b]=x
    return {'consistent':not conflicts,'attempted_mapping':{str(k):v for k,v in sorted(forward.items())},'conflict_count':len(conflicts),'first_conflicts':conflicts[:8]}


def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('graph',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
    raw=a.graph.read_bytes();r=json.loads(gzip.decompress(raw) if a.graph.suffix=='.gz' else raw)
    g=r['inverse_branch_with_edge_swap'];assert g['topology_only_ignoring_register_names_and_code']['verified']
    original={n['offset']:n for n in g['original']['nodes']};candidate={n['offset']:n for n in g['candidate']['nodes']};mapping=g['topology_only_ignoring_register_names_and_code']['mapping']
    all_rows=[];blocks=[]
    for oa,ca in mapping.items():
        o,c=original[oa],candidate[ca];rows=[];assert len(o['code'])==len(c['code'])
        pairs=[(x['offset'],y['offset'],struct.unpack('<BBhi',bytes.fromhex(x['official_normalized_value'])),struct.unpack('<BBhi',bytes.fromhex(y['official_normalized_value']))) for x,y in zip(o['code'],c['code'])]
        if o['term']['kind']=='conditional':
            ot,ct=o['term'],c['term'];assert ot['opcode']==ct['opcode'] and ot['immediate']==ct['immediate']
            pairs.append((o['machine_terminators'][-1]['offset'],c['machine_terminators'][-1]['offset'],(ot['opcode'],ot['registers'],0,ot['immediate']),(ct['opcode'],ct['registers'],0,ct['immediate'])))
        for off,coff,(op,oreg,d,imm),(cop,creg,cd,cimm) in pairs:
            assert (op,d,imm)==(cop,cd,cimm)
            left,right=operands(op,oreg),operands(cop,creg);assert [k for k,_ in left]==[k for k,_ in right]
            for (kind,ore),(unused,cre) in zip(left,right):rows.append({'original_offset':off,'candidate_offset':coff,'operand':kind,'original_register':ore,'candidate_register':cre,'original_block':oa,'candidate_block':ca})
        blocks.append({'original_block':oa,'candidate_block':ca,'constraint_count':len(rows),**check(rows)});all_rows+=rows
    report={'scope':__doc__,'graph_sha256':hashlib.sha256(raw).hexdigest(),'official_sell_status':'UNEQUAL','original_sha256':r['original_sha256'],'candidate_sha256':r['candidate_sha256'],
            'direction':'candidate physical register -> original physical register','used_operand_constraints':len(all_rows),'global':check(all_rows),
            'per_block':{'consistent_blocks':sum(b['consistent'] for b in blocks),'total_blocks':len(blocks),'blocks':blocks},
            'conclusion':'No single global register bijection exists. Some blocks also reject a fixed local renaming. Any equivalence argument requires finer program-point/live-range reasoning, which this diagnostic does not prove.'}
    a.output.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'global_consistent':report['global']['consistent'],'global_conflicts':report['global']['conflict_count'],'per_block_consistent':report['per_block']['consistent_blocks'],'total_blocks':len(blocks),'constraints':len(all_rows)}))


if __name__=='__main__':main()
