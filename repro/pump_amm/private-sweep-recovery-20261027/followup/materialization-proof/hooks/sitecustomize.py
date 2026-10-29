"""Read-only audit of private saved-verifier runs, including child processes."""
import atexit,json,os,sys
root=os.environ.get('AMM_AUDIT_FORBIDDEN_ROOT');private=os.environ.get('AMM_AUDIT_PRIVATE_ROOT');log=os.environ.get('AMM_AUDIT_LOG_DIR')
if root and private and log:
 accesses={};subprocesses=[];denied=[]
 def hook(event,args):
  if event in ('open','os.listdir','os.scandir')and args and isinstance(args[0],(str,bytes)):
   path=os.path.abspath(os.fsdecode(args[0]))
   if path==root or path.startswith(root+os.sep):
    denied.append({'event':event,'path':path});raise RuntimeError('Saved verifier accessed immutable source checkpoint: '+path)
   if path==private or path.startswith(private+os.sep):accesses[path[len(private):].lstrip(os.sep)]=accesses.get(path[len(private):].lstrip(os.sep),0)+1
  elif event=='subprocess.Popen':subprocesses.append([str(x)for x in args[1]])
 sys.addaudithook(hook)
 def flush():
  os.makedirs(log,exist_ok=True)
  with open(os.path.join(log,str(os.getpid())+'.json'),'w')as f:json.dump({'pid':os.getpid(),'argv':sys.argv,'private_accesses':accesses,'subprocesses':subprocesses,'denied':denied},f,indent=2);f.write('\n')
 atexit.register(flush)
