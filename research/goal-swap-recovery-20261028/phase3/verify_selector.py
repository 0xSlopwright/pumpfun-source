from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent

def run():
 for row in json.loads((R/'llvm/sources.json').read_text()):
  assert hashlib.sha256((R/'llvm'/row['name']).read_bytes()).hexdigest()==row['sha256']
 fold=(R/'llvm/BranchFolding.cpp').read_text();placement=(R/'llvm/MachineBlockPlacement.cpp').read_text();mbb=(R/'llvm/MachineBasicBlock.cpp').read_text()
 assert 'if (getBlock()->getNumber() < o.getBlock()->getNumber())' in fold
 assert 'for (MPIterator CurMPIter = std::prev(MergePotentials.end()),' in fold
 assert 'if (SameTails[i].tailIsWholeBlock())\n          commonTailIndex = i;' in fold
 start=fold.index('bool BranchFolder::TryTailMergeBlocks')
 assert fold.index('setCommonTailEdgeWeights(*MBB);',start)>fold.index('MachineBasicBlock *MBB = SameTails[commonTailIndex].getBlock();',start)
 assert 'if (AfterPlacement && FullBlockTail1 && FullBlockTail2)' in fold
 assert 'if (!isSuccessor(&*Fallthrough))\n    return nullptr;' in mbb
 assert '/*AfterPlacement=*/true' in placement
 enabled=json.loads((R/'complete-placement-snapshots.json').read_text())['snapshots']
 disabled=json.loads((R/'no-placement-fold/placement-analysis.json').read_text())
 before=next(s for s in enabled if s['stage']=='Before')['blocks_data']
 assert before==next(s for s in disabled if s['stage']=='Before')['blocks_data']
 first=next(s for s in disabled if s['stage']=='After')['blocks_data']
 exit=next(s for s in first if s['ir_id']==104);idx=first.index(exit);pred=first[idx-1]
 assert exit['machine_id']==5 and pred['machine_id']==13
 whole=[]
 for n in first:
  if n['instructions']==['$r6 = LDD_V1 $r10, -1304','JMP %bb.5']:
   i=first.index(n);assert i+1==len(first)or first[i+1]['machine_id']!=5;whole.append(n)
 assert sorted(n['machine_id']for n in whole)==[63,72,83]
 assert pred not in whole
 same=sorted(whole,key=lambda n:n['machine_id'],reverse=True);selected=None;history=[]
 for node in same:
  selected=node;history.append(node['machine_id'])
 assert history==[83,72,63] and selected['ir_id']==432
 after=next(s for s in enabled if s['stage']=='After')['blocks_data']
 survivor=[n for n in after if n['instructions']==['$r6 = LDD_V1 $r10, -1304','JMP %bb.17']]
 assert len(survivor)==1 and survivor[0]['ir_id']==432
 print(json.dumps({'pinned_sources_verified':True,'pre_placement_snapshots_equal':True,'layout_predecessor':13,'whole_candidate_order':history,'winner_ir':432,'observed_survivor_ir':survivor[0]['ir_id'],'new_windows':0},indent=2))
if __name__=='__main__':run()
