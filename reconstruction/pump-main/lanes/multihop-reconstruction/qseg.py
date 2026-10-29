import sys,subprocess,os
H=os.path.dirname(os.path.abspath(__file__))
o=sys.argv[1]; bh=sys.argv[2] if len(sys.argv)>2 else None
r=subprocess.run(['python3',H+'/qcmp.py',o]+([bh] if bh else []),capture_output=True,text=True).stdout.strip()
if r.startswith('same'): print(r); sys.exit()
h=r.split()[-1]
s=subprocess.run(['python3',H+'/seg.py',o],capture_output=True,text=True).stdout.strip().split('\n')[-1]
print(s,r.split('opregs')[1].split()[0],h)
