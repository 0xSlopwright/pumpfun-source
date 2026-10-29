
/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-source/evidence/original/pump/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
  167796:	mov64 r6, r5
  167797:	stxdw [r10 - 0x1e0], r4
  167798:	mov64 r8, r3
  167799:	stxdw [r10 - 0x1d8], r1
  167800:	stxdw [r10 - 0x1e8], r2
  167801:	ldxdw r9, [r2 + 0x8]
  167802:	ldxdw r2, [r9 + 0x28]
  167803:	mov64 r3, r9
  167804:	add64 r3, 0x70
  167805:	mov64 r4, r9
  167806:	add64 r4, 0x40
  167807:	mov64 r1, r10
  167808:	add64 r1, -0x140
  167809:	call -0x215d8
  167810:	ldxdw r7, [r10 - 0x140]
  167811:	jne r7, 0x2, +0x3a <.text+0x147cd0>
  167812:	ldxdw r1, [r9 + 0x28]
  167813:	ldxb r3, [r1 + 0xa3]
  167814:	ldxb r2, [r1 + 0xa1]
  167815:	mov64 r1, r10
  167816:	add64 r1, -0x150
  167817:	mov64 r4, 0x0
  167818:	call -0x19375
  167819:	ldxdw r7, [r10 - 0x150]
  167820:	jeq r7, 0x2, +0x1 <.text+0x147b50>
  167821:	ja +0x32 <.text+0x147ce0>
  167822:	ldxdw r2, [r9 + 0x0]
  167823:	ldxdw r1, [r9 + 0x28]
  167824:	ldxdw r7, [r1 + 0x58]
  167825:	ldxdw r3, [r9 + 0x40]
  167826:	ldxdw r3, [r3 + 0x0]
  167827:	ldxdw r4, [r3 + 0x18]
  167828:	stxdw [r10 - 0x90], r4
  167829:	ldxdw r4, [r3 + 0x10]
  167830:	stxdw [r10 - 0x98], r4
  167831:	ldxdw r4, [r3 + 0x8]
  167832:	stxdw [r10 - 0xa0], r4
  167833:	ldxdw r3, [r3 + 0x0]
  167834:	stxdw [r10 - 0xa8], r3
  167835:	ldxb r1, [r1 + 0xa2]
  167836:	jeq r1, 0x0, +0x25 <.text+0x147cf0>
  167837:	mov64 r1, 0x0
  167838:	jeq r6, 0x0, +0x2 <.text+0x147be8>
  167839:	jlt r8, r7, +0x1 <.text+0x147be8>
  167840:	mov64 r8, r7
  167841:	jeq r8, 0x0, +0x2d <.text+0x147d58>
  167842:	stxdw [r10 - 0x1f0], r8
  167843:	jlt r7, r8, +0x1 <.text+0x147c08>
  167844:	ja +0x6e <.text+0x147f78>
  167845:	mov64 r1, r10
  167846:	add64 r1, -0x130
  167847:	lddw r2, 0x1b5f40
  167849:	call 0x1ec6
  167850:	stdw [r10 - 0x100], 0x0
  167851:	stdw [r10 - 0x108], 0x1
  167852:	stdw [r10 - 0x110], 0x0
  167853:	lddw r1, 0x1bd838
  167855:	stxdw [r10 - 0xc8], r1
  167856:	mov64 r1, r10
  167857:	add64 r1, -0x110
  167858:	stxdw [r10 - 0xd0], r1
  167859:	stb [r10 - 0xb8], 0x3
  167860:	stdw [r10 - 0xc0], 0x20
  167861:	stdw [r10 - 0xe0], 0x0
  167862:	stdw [r10 - 0xf0], 0x0
  167863:	mov64 r2, r10
  167864:	add64 r2, -0xf0
  167865:	lddw r1, 0x1b5f40
  167867:	call 0x2c15
  167868:	jeq r0, 0x0, +0x61 <.text+0x147fd0>
  167869:	ja +0x29 <.text+0x147e18>
  167870:	ldxdw r6, [r10 - 0x138]
  167871:	ja +0x100 <.text+0x1484e0>
  167872:	ldxdw r6, [r10 - 0x148]
  167873:	ja +0xfe <.text+0x1484e0>
  167874:	add64 r2, 0x288
  167875:	mov64 r1, r10
  167876:	add64 r1, -0xa8
  167877:	mov64 r3, 0x20
  167878:	call 0xd708
  167879:	jle r8, r7, -0x2b <.text+0x147bc8>
  167880:	lsh64 r0, 0x20
  167881:	rsh64 r0, 0x20
  167882:	jne r0, 0x0, +0x1 <.text+0x147d40>
  167883:	ja -0x2f <.text+0x147bc8>
  167884:	mov64 r1, r8
  167885:	sub64 r1, r7
  167886:	ja -0x2f <.text+0x147be0>
  167887:	mov64 r1, r10
  167888:	add64 r1, -0x130
  167889:	lddw r2, 0x1b5e34
  167891:	call 0x1e9c
  167892:	stdw [r10 - 0x100], 0x0
  167893:	stdw [r10 - 0x108], 0x1
  167894:	stdw [r10 - 0x110], 0x0
  167895:	lddw r1, 0x1bd838
  167897:	stxdw [r10 - 0xc8], r1
  167898:	mov64 r1, r10
  167899:	add64 r1, -0x110
  167900:	stxdw [r10 - 0xd0], r1
  167901:	stb [r10 - 0xb8], 0x3
  167902:	stdw [r10 - 0xc0], 0x20
  167903:	stdw [r10 - 0xe0], 0x0
  167904:	stdw [r10 - 0xf0], 0x0
  167905:	mov64 r2, r10
  167906:	add64 r2, -0xf0
  167907:	lddw r1, 0x1b5e34
  167909:	call 0x2beb
  167910:	jeq r0, 0x0, +0xa <.text+0x147e68>
  167911:	mov64 r3, r10
  167912:	add64 r3, -0x1
  167913:	lddw r1, 0x1b5fa4
  167915:	mov64 r2, 0x37
  167916:	lddw r4, 0x1bd868
  167918:	lddw r5, 0x1bd888
  167920:	call 0xc9d2
  167921:	ldxdw r1, [r10 - 0x100]
  167922:	stxdw [r10 - 0x60], r1
  167923:	ldxdw r1, [r10 - 0x108]
  167924:	stxdw [r10 - 0x68], r1
  167925:	ldxdw r1, [r10 - 0x110]
  167926:	stxdw [r10 - 0x70], r1
  167927:	ldxdw r1, [r10 - 0x130]
  167928:	stxdw [r10 - 0x88], r1
  167929:	ldxdw r1, [r10 - 0x128]
  167930:	stxdw [r10 - 0x80], r1
  167931:	ldxdw r1, [r10 - 0x120]
  167932:	stxdw [r10 - 0x78], r1
  167933:	lddw r1, 0x1b723b
  167935:	stxdw [r10 - 0xa0], r1
  167936:	stw [r10 - 0x10], 0x1784
  167937:	stb [r10 - 0x58], 0x2
  167938:	stw [r10 - 0x90], 0x321
  167939:	stdw [r10 - 0x98], 0x1d
  167940:	stdw [r10 - 0xa8], 0x0
  167941:	mov64 r1, r10
  167942:	add64 r1, -0x1c0
  167943:	mov64 r2, r10
  167944:	add64 r2, -0xa8
  167945:	call 0xa75c
  167946:	ldxdw r3, [r10 - 0x1b8]
  167947:	ldxdw r2, [r10 - 0x1c0]
  167948:	mov64 r1, r10
  167949:	add64 r1, -0x1d0
  167950:	mov64 r4, 0x0
  167951:	call -0x28fa8
  167952:	ldxdw r6, [r10 - 0x1c8]
  167953:	ldxdw r7, [r10 - 0x1d0]
  167954:	ja +0xad <.text+0x1484e0>
  167955:	mov64 r8, r1
  167956:	mov64 r1, r10
  167957:	add64 r1, -0xa8
  167958:	mov64 r2, r9
  167959:	call -0x19216
  167960:	ldxdw r1, [r10 - 0xa0]
  167961:	jeq r1, 0x2, +0x1 <.text+0x147fb8>
  167962:	ja +0x26 <.text+0x1480e8>
  167963:	ldxdw r6, [r10 - 0x90]
  167964:	ldxdw r7, [r10 - 0x98]
  167965:	ja +0xa2 <.text+0x1484e0>
  167966:	ldxdw r1, [r10 - 0x100]
  167967:	stxdw [r10 - 0x60], r1
  167968:	ldxdw r1, [r10 - 0x108]
  167969:	stxdw [r10 - 0x68], r1
  167970:	ldxdw r1, [r10 - 0x110]
  167971:	stxdw [r10 - 0x70], r1
  167972:	ldxdw r1, [r10 - 0x130]
  167973:	stxdw [r10 - 0x88], r1
  167974:	ldxdw r1, [r10 - 0x128]
  167975:	stxdw [r10 - 0x80], r1
  167976:	ldxdw r1, [r10 - 0x120]
  167977:	stxdw [r10 - 0x78], r1
  167978:	lddw r1, 0x1b723b
  167980:	stxdw [r10 - 0xa0], r1
  167981:	stw [r10 - 0x10], 0x1785
  167982:	stb [r10 - 0x58], 0x2
  167983:	stw [r10 - 0x90], 0x322
  167984:	stdw [r10 - 0x98], 0x1d
  167985:	stdw [r10 - 0xa8], 0x0
  167986:	mov64 r1, r10
  167987:	add64 r1, -0x1a0
  167988:	mov64 r2, r10
  167989:	add64 r2, -0xa8
  167990:	call 0xa72f
  167991:	ldxdw r3, [r10 - 0x198]
  167992:	ldxdw r2, [r10 - 0x1a0]
  167993:	mov64 r1, r10
  167994:	add64 r1, -0x1b0
  167995:	mov64 r4, r7
  167996:	ldxdw r5, [r10 - 0x1f0]
  167997:	call -0x28e08
  167998:	ldxdw r6, [r10 - 0x1a8]
  167999:	ldxdw r7, [r10 - 0x1b0]
  168000:	ja +0x7f <.text+0x1484e0>
  168001:	ldxb r6, [r10 - 0xa8]
  168002:	ldxdw r2, [r10 - 0x98]
  168003:	ldxdw r3, [r10 - 0x90]
  168004:	ldxdw r4, [r10 - 0x88]
  168005:	stxdw [r10 - 0x118], r4
  168006:	stxdw [r10 - 0x120], r3
  168007:	stxdw [r10 - 0x128], r2
  168008:	stxdw [r10 - 0x130], r1
  168009:	ldxdw r2, [r9 + 0x28]
  168010:	add64 r2, 0x8
  168011:	mov64 r1, r10
  168012:	add64 r1, -0xa8
  168013:	ldxdw r3, [r10 - 0x1f0]
  168014:	call -0x15041
  168015:	ldxdw r7, [r10 - 0xa0]
  168016:	ldxdw r1, [r10 - 0xa8]
  168017:	jeq r1, 0x0, +0x2 <.text+0x148180>
  168018:	ldxdw r6, [r10 - 0x98]
  168019:	ja +0x6c <.text+0x1484e0>
  168020:	ldxdw r1, [r10 - 0x98]
  168021:	jeq r1, 0x0, +0x6 <.text+0x1481c0>
  168022:	mov64 r1, r10
  168023:	add64 r1, -0x160
  168024:	call -0x186a9
  168025:	ldxdw r6, [r10 - 0x158]
  168026:	ldxdw r7, [r10 - 0x160]
  168027:	ja +0x64 <.text+0x1484e0>
  168028:	stxdw [r10 - 0x1f8], r6
  168029:	mov64 r1, r10
  168030:	add64 r1, -0xa8
  168031:	mov64 r2, r9
  168032:	mov64 r3, r7
  168033:	call -0x190a5
  168034:	ldxdw r6, [r10 - 0x98]
  168035:	ldxdw r4, [r10 - 0xa0]
  168036:	ldxdw r1, [r10 - 0xa8]
  168037:	jeq r1, 0x0, +0x2 <.text+0x148220>
  168038:	mov64 r7, r4
  168039:	ja +0x58 <.text+0x1484e0>
  168040:	ldxdw r0, [r10 - 0x1f8]
  168041:	and64 r0, 0x1
  168042:	ldxdw r1, [r10 - 0x88]
  168043:	stxdw [r10 - 0xf8], r1
  168044:	ldxdw r1, [r10 - 0x90]
  168045:	stxdw [r10 - 0x100], r1
  168046:	stxdw [r10 - 0x108], r6
  168047:	stxdw [r10 - 0x110], r4
  168048:	mov64 r5, 0x0
  168049:	mov64 r1, 0x0
  168050:	mov64 r2, r8
  168051:	stxdw [r10 - 0x1f8], r0
  168052:	stxdw [r10 - 0x200], r4
  168053:	jeq r2, 0x0, +0x31 <.text+0x148418>
  168054:	ldxdw r1, [r9 + 0x0]
  168055:	ldxdw r3, [r1 + 0x410]
  168056:	ldxdw r1, [r9 + 0x28]
  168057:	ldxdw r2, [r1 + 0x60]
  168058:	ldxdw r1, [r9 + 0x30]
  168059:	ldxdw r4, [r1 + 0x68]
  168060:	ldxdw r1, [r10 - 0x1f0]
  168061:	stxdw [r10 - 0xff8], r1
  168062:	stxdw [r10 - 0xff0], r7
  168063:	stxdw [r10 - 0x1000], r0
  168064:	mov64 r1, r10
  168065:	add64 r1, -0xa8
  168066:	mov64 r5, r10
  168067:	call -0x18c5f
  168068:	ldxdw r3, [r10 - 0xa0]
  168069:	ldxdw r1, [r10 - 0xa8]
  168070:	jeq r1, 0x0, +0x3 <.text+0x148330>
  168071:	ldxdw r6, [r10 - 0x98]
  168072:	mov64 r7, r3
  168073:	ja +0x36 <.text+0x1484e0>
  168074:	ldxdw r1, [r10 - 0x1f8]
  168075:	ldxdw r4, [r10 - 0x98]
  168076:	mov64 r1, r10
  168077:	add64 r1, -0xa8
  168078:	mov64 r2, r9
  168079:	mov64 r5, r8
  168080:	call -0x18b32
  168081:	ldxdw r3, [r10 - 0x98]
  168082:	ldxdw r2, [r10 - 0xa0]
  168083:	ldxdw r1, [r10 - 0xa8]
  168084:	jeq r1, 0x0, +0x1 <.text+0x148390>
  168085:	ja +0x28 <.text+0x1484d0>
  168086:	mov64 r1, r10
  168087:	add64 r1, -0xd8
  168088:	stxdw [r10 - 0x208], r2
  168089:	mov64 r2, r10
  168090:	add64 r2, -0x90
  168091:	stxdw [r10 - 0x210], r3
  168092:	mov64 r3, 0x30
  168093:	call 0xd624
  168094:	ldxdw r1, [r10 - 0x210]
  168095:	stxdw [r10 - 0xe0], r1
  168096:	ldxdw r1, [r10 - 0x208]
  168097:	stxdw [r10 - 0xe8], r1
  168098:	mov64 r1, 0x1
  168099:	mov64 r2, r8
  168100:	ldxdw r0, [r10 - 0x1f8]
  168101:	ldxdw r4, [r10 - 0x200]
  168102:	mov64 r5, 0x0
  168103:	jeq r2, 0x0, +0x2 <.text+0x148430>
  168104:	mov64 r5, r10
  168105:	add64 r5, -0xe8
  168106:	stxdw [r10 - 0xf0], r1
  168107:	ldxdw r1, [r9 + 0x28]
  168108:	ldxb r3, [r1 + 0xa2]
  168109:	ldxdw r1, [r9 + 0x0]
  168110:	ldxdw r2, [r1 + 0x420]
  168111:	stxdw [r10 - 0xff0], r6
  168112:	stxdw [r10 - 0xff8], r4
  168113:	stxdw [r10 - 0x1000], r7
  168114:	stxdw [r10 - 0xfe8], r5
  168115:	mov64 r1, r10
  168116:	add64 r1, -0xa8
  168117:	mov64 r4, r10
  168118:	add64 r4, -0x130
  168119:	mov64 r8, r5
  168120:	mov64 r5, r10
  168121:	call -0x18efb
  168122:	ldxdw r3, [r10 - 0x98]
  168123:	ldxdw r2, [r10 - 0xa0]
  168124:	ldxdw r1, [r10 - 0xa8]
  168125:	jeq r1, 0x0, +0x6 <.text+0x148500>
  168126:	mov64 r6, r3
  168127:	mov64 r7, r2
  168128:	ldxdw r1, [r10 - 0x1d8]
  168129:	stxdw [r1 + 0x8], r6
  168130:	stxdw [r1 + 0x0], r7
  168131:	exit
  168132:	stxdw [r10 - 0x210], r8
  168133:	ldxdw r1, [r10 - 0x200]
  168134:	ldxdw r1, [r10 - 0x90]
  168135:	stxdw [r10 - 0x218], r1
  168136:	mov64 r1, r10
  168137:	add64 r1, -0xa8
  168138:	stxdw [r10 - 0x208], r2
  168139:	mov64 r8, r3
  168140:	call -0x18dc4
  168141:	ldxdw r1, [r10 - 0xa8]
  168142:	jeq r1, 0x2, +0x1 <.text+0x148560>
  168143:	ja +0x31 <.text+0x1486e8>
  168144:	ldxdw r4, [r10 - 0x1f8]
  168145:	ldxdw r1, [r10 - 0xa0]
  168146:	ldxdw r2, [r10 - 0x1e0]
  168147:	jgt r1, r2, +0x1 <.text+0x148588>
  168148:	ja +0x2f <.text+0x148700>
  168149:	mov64 r1, r10
  168150:	add64 r1, -0x88
  168151:	lddw r2, 0x1b5e70
  168153:	call 0x1d96
  168154:	mov64 r1, r10
  168155:	add64 r1, -0x70
  168156:	lddw r2, 0x1b5e70
  168158:	call -0x27bb8
  168159:	lddw r1, 0x1b723b
  168161:	stxdw [r10 - 0xa0], r1
  168162:	stb [r10 - 0x58], 0x2
  168163:	stw [r10 - 0x90], 0x34a
  168164:	stdw [r10 - 0x98], 0x1d
  168165:	stdw [r10 - 0xa8], 0x0
  168166:	stw [r10 - 0x10], 0x1772
  168167:	mov64 r1, r10
  168168:	add64 r1, -0x180
  168169:	mov64 r2, r10
  168170:	add64 r2, -0xa8
  168171:	call 0xa67a
  168172:	ldxdw r1, [r10 - 0x178]
  168173:	stxdw [r10 - 0x1e8], r1
  168174:	ldxdw r9, [r10 - 0x180]
  168175:	mov64 r1, r10
  168176:	add64 r1, -0xa8
  168177:	ldxdw r2, [r10 - 0x208]
  168178:	mov64 r3, r8
  168179:	call -0x18deb
  168180:	ldxdw r7, [r10 - 0xa8]
  168181:	jeq r7, 0x2, +0x1 <.text+0x148698>
  168182:	ja +0x28 <.text+0x1487d8>
  168183:	ldxdw r5, [r10 - 0xa0]
  168184:	mov64 r1, r10
  168185:	add64 r1, -0x190
  168186:	mov64 r2, r9
  168187:	ldxdw r3, [r10 - 0x1e8]
  168188:	ldxdw r4, [r10 - 0x1e0]
  168189:	call -0x28ec8
  168190:	ldxdw r6, [r10 - 0x188]
  168191:	ldxdw r7, [r10 - 0x190]
  168192:	ja -0x41 <.text+0x1484e0>
  168193:	ldxdw r6, [r10 - 0xa0]
  168194:	mov64 r7, r1
  168195:	ja -0x44 <.text+0x1484e0>
  168196:	ldxdw r1, [r10 - 0x1e8]
  168197:	ldxb r3, [r1 + 0x21]
  168198:	stxdw [r10 - 0xfd0], r8
  168199:	mov64 r1, r10
  168200:	add64 r1, -0x130
  168201:	stxdw [r10 - 0xfc8], r1
  168202:	ldxdw r1, [r10 - 0x208]
  168203:	stxdw [r10 - 0xfd8], r1
  168204:	ldxdw r1, [r10 - 0x210]
  168205:	stxdw [r10 - 0xfe0], r1
  168206:	stxdw [r10 - 0xfe8], r6
  168207:	ldxdw r1, [r10 - 0x200]
  168208:	stxdw [r10 - 0xff0], r1
  168209:	stxdw [r10 - 0xff8], r7
  168210:	ldxdw r6, [r10 - 0x1f0]
  168211:	stxdw [r10 - 0x1000], r6
  168212:	mov64 r1, r10
  168213:	add64 r1, -0xa8
  168214:	mov64 r5, r10
  168215:	mov64 r2, r9
  168216:	call -0x18999
  168217:	ldxdw r1, [r10 - 0xa0]
  168218:	ldxdw r2, [r10 - 0xa8]
  168219:	jeq r2, 0x0, +0x8 <.text+0x148800>
  168220:	ldxdw r6, [r10 - 0x98]
  168221:	mov64 r7, r1
  168222:	ja -0x5f <.text+0x1484e0>
  168223:	ldxdw r6, [r10 - 0xa0]
  168224:	mov64 r1, r9
  168225:	ldxdw r2, [r10 - 0x1e8]
  168226:	call -0x27ae4
  168227:	ja -0x64 <.text+0x1484e0>
  168228:	ldxdw r2, [r10 - 0x98]
  168229:	ldxdw r3, [r10 - 0x1e8]
  168230:	ldxb r3, [r3 + 0x24]
  168231:	mov64 r4, r10
  168232:	add64 r4, -0xf0
  168233:	stxdw [r10 - 0xfd0], r4
  168234:	stxdw [r10 - 0xfc8], r2
  168235:	lddw r2, 0x1b6862
  168237:	stxdw [r10 - 0xfe0], r2
  168238:	ldxdw r2, [r10 - 0x218]
  168239:	stxdw [r10 - 0xfe8], r2
  168240:	stxdw [r10 - 0xff0], r1
  168241:	mov64 r1, r10
  168242:	add64 r1, -0x110
  168243:	stxdw [r10 - 0xff8], r1
  168244:	stxdw [r10 - 0x1000], r7
  168245:	stdw [r10 - 0xfd8], 0x3
  168246:	mov64 r1, r10
  168247:	add64 r1, -0x170
  168248:	mov64 r5, r10
  168249:	mov64 r2, r9
  168250:	mov64 r4, r6
  168251:	call -0x18606
  168252:	ldxdw r6, [r10 - 0x168]
  168253:	ldxdw r7, [r10 - 0x170]
  168254:	ja -0x7f <.text+0x1484e0>
