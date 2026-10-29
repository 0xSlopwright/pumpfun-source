import struct
def archive_objects(data):
    assert data.startswith(b'!<arch>\n'); pos=8; names=b''; result={}
    while pos < len(data):
        head=data[pos:pos+60]; assert len(head)==60 and head[58:60]==b'`\n'
        size=int(head[48:58]); name=head[:16].decode().strip(); payload=data[pos+60:pos+60+size]
        assert len(payload)==size
        if name=='//': names=payload
        elif name.startswith('/') and name[1:].isdigit():
            result[names[int(name[1:]):].split(b'/\n',1)[0].decode()]=payload
        elif name!='/': result[name.rstrip('/')]=payload
        pos += 60+size+(size%2)
    assert pos==len(data)
    return result

def object_method(b, method):
    offset=struct.unpack_from('<Q',b,40)[0]; size,count,ni=struct.unpack_from('<HHH',b,58)
    raw=[struct.unpack_from('<IIQQQQIIQQ',b,offset+i*size) for i in range(count)]
    s=raw[ni]; strings=b[s[4]:s[4]+s[5]]
    sections=[(strings[s[0]:].split(b'\0',1)[0].decode(),s) for s in raw]
    methods=[(n,s) for n,s in sections if n.startswith('.text.') and method in n]
    assert len(methods)==1
    name,s=methods[0]; idx=raw.index(s); body=bytearray(b[s[4]:s[4]+s[5]]); calls=[]
    for _,r in sections:
        if r[1] not in (4,9) or r[7]!=idx: continue
        st=raw[r[6]]; sr=raw[st[6]]; names=b[sr[4]:sr[4]+sr[5]]
        for p in range(r[4],r[4]+r[5],r[9]):
            at,info=struct.unpack_from('<QQ',b,p); sn=struct.unpack_from('<I',b,st[4]+(info>>32)*24)[0]
            sym=names[sn:].split(b'\0',1)[0].decode(); assert info&0xffffffff==10 and body[at]==0x85
            body[at+4:at+8]=bytes(4); calls.append((at,sym))
    return bytes(body),calls
