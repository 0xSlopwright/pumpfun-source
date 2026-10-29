import re,sys,glob
d=sys.argv[1]; lo,hi=int(sys.argv[2]),int(sys.argv[3])
f=[x for x in glob.glob(d+'/*PreCodegen.after.mir') if 'closure' not in x and 'promoted' not in x][0]
t=open(f).read()
for name,cl,body in re.findall(r'\n    (bb\d+)( \(cleanup\))?: \{(.*?)\n    \}',t,re.S):
    n=int(name[2:])
    if lo<=n<=hi: print(name, '|', ' ; '.join([l.strip() for l in body.strip().splitlines() if 'Storage' not in l][-2:])[:260])
