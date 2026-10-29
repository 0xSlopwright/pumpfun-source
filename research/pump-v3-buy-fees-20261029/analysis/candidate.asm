
/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol/buy-fees-tuple/symbols.so:	file format elf64-sbf

Disassembly of section .text:

000000000009fe18 <_ZN14pump_recovered5trade3buy17h8ba47e197d5a9d68E>:
   81859:	mov64 r9, r5
   81860:	stxdw [r10 - 0x1e0], r4
   81861:	mov64 r6, r3
   81862:	stxdw [r10 - 0x1d8], r1
   81863:	stxdw [r10 - 0x1e8], r2
   81864:	ldxdw r8, [r2 + 0x8]
   81865:	ldxdw r2, [r8 + 0x28]
   81866:	mov64 r3, r8
   81867:	add64 r3, 0x70
   81868:	mov64 r4, r8
   81869:	add64 r4, 0x40
   81870:	mov64 r1, r10
   81871:	add64 r1, -0x140
   81872:	call 0x1d35
   81873:	ldxdw r7, [r10 - 0x140]
   81874:	jne r7, 0x2, +0x4f <LBB384_2>
   81875:	ldxdw r1, [r8 + 0x28]
   81876:	ldxb r3, [r1 + 0xa3]
   81877:	ldxb r2, [r1 + 0xa1]
   81878:	mov64 r1, r10
   81879:	add64 r1, -0x150
   81880:	mov64 r4, 0x0
   81881:	stxdw [r10 - 0x1f0], r4
   81882:	call -0x1049
   81883:	ldxdw r7, [r10 - 0x150]
   81884:	jeq r7, 0x2, +0x1 <LBB384_3>
   81885:	ja +0x46 <LBB384_4>

000000000009fef0 <LBB384_3>:
   81886:	ldxdw r1, [r8 + 0x28]
   81887:	ldxdw r4, [r1 + 0x58]
   81888:	ldxb r1, [r1 + 0xa2]
   81889:	jeq r1, 0x0, +0x1 <LBB384_5>
   81890:	ja +0x19 <LBB384_8>

000000000009ff18 <LBB384_5>:
   81891:	ldxdw r1, [r8 + 0x40]
   81892:	ldxdw r1, [r1 + 0x0]
   81893:	ldxdw r2, [r1 + 0x18]
   81894:	stxdw [r10 - 0x90], r2
   81895:	ldxdw r2, [r1 + 0x10]
   81896:	stxdw [r10 - 0x98], r2
   81897:	ldxdw r2, [r1 + 0x8]
   81898:	stxdw [r10 - 0xa0], r2
   81899:	ldxdw r1, [r1 + 0x0]
   81900:	stxdw [r10 - 0xa8], r1
   81901:	ldxdw r2, [r8 + 0x0]
   81902:	add64 r2, 0x288
   81903:	mov64 r1, r10
   81904:	add64 r1, -0xa8
   81905:	mov64 r3, 0x20
   81906:	mov64 r7, r4
   81907:	call 0x22b42
   81908:	mov64 r4, r7
   81909:	jle r6, r4, +0x6 <LBB384_8>
   81910:	lsh64 r0, 0x20
   81911:	rsh64 r0, 0x20
   81912:	jeq r0, 0x0, +0x3 <LBB384_8>
   81913:	mov64 r1, r6
   81914:	sub64 r1, r4
   81915:	stxdw [r10 - 0x1f0], r1

000000000009ffe0 <LBB384_8>:
   81916:	mov64 r1, r4
   81917:	ldxdw r2, [r10 - 0x1f0]
   81918:	jne r2, 0x0, +0x1 <LBB384_10>
   81919:	mov64 r1, r6

00000000000a0000 <LBB384_10>:
   81920:	mov64 r7, r4
   81921:	jne r9, 0x0, +0x1 <LBB384_12>
   81922:	mov64 r7, r1

00000000000a0018 <LBB384_12>:
   81923:	jge r6, r4, +0x1 <LBB384_14>
   81924:	mov64 r7, r1

00000000000a0028 <LBB384_14>:
   81925:	jeq r7, 0x0, +0x20 <LBB384_16>
   81926:	mov64 r6, r4
   81927:	jlt r4, r7, +0x1 <LBB384_20>
   81928:	ja +0x61 <LBB384_19>

00000000000a0048 <LBB384_20>:
   81929:	mov64 r1, r10
   81930:	add64 r1, -0x130
   81931:	lddw r2, 0x1b8298
   81933:	call 0x16f63
   81934:	stdw [r10 - 0x100], 0x0
   81935:	stdw [r10 - 0x108], 0x1
   81936:	stdw [r10 - 0x110], 0x0
   81937:	lddw r1, 0x1bfb70
   81939:	stxdw [r10 - 0xc8], r1
   81940:	mov64 r1, r10
   81941:	add64 r1, -0x110
   81942:	stxdw [r10 - 0xd0], r1
   81943:	stb [r10 - 0xb8], 0x3
   81944:	stdw [r10 - 0xc0], 0x20
   81945:	stdw [r10 - 0xe0], 0x0
   81946:	stdw [r10 - 0xf0], 0x0
   81947:	mov64 r2, r10
   81948:	add64 r2, -0xf0
   81949:	lddw r1, 0x1b8298
   81951:	call 0x17cb2
   81952:	jeq r0, 0x0, +0x53 <LBB384_22>
   81953:	ja +0x1c <LBB384_17>

00000000000a0110 <LBB384_2>:
   81954:	ldxdw r6, [r10 - 0x138]
   81955:	ja +0x9b <LBB384_48>

00000000000a0120 <LBB384_4>:
   81956:	ldxdw r6, [r10 - 0x148]
   81957:	ja +0x99 <LBB384_48>

00000000000a0130 <LBB384_16>:
   81958:	mov64 r1, r10
   81959:	add64 r1, -0x130
   81960:	lddw r2, 0x1b818c
   81962:	call 0x16f46
   81963:	stdw [r10 - 0x100], 0x0
   81964:	stdw [r10 - 0x108], 0x1
   81965:	stdw [r10 - 0x110], 0x0
   81966:	lddw r1, 0x1bfb70
   81968:	stxdw [r10 - 0xc8], r1
   81969:	mov64 r1, r10
   81970:	add64 r1, -0x110
   81971:	stxdw [r10 - 0xd0], r1
   81972:	stb [r10 - 0xb8], 0x3
   81973:	stdw [r10 - 0xc0], 0x20
   81974:	stdw [r10 - 0xe0], 0x0
   81975:	stdw [r10 - 0xf0], 0x0
   81976:	mov64 r2, r10
   81977:	add64 r2, -0xf0
   81978:	lddw r1, 0x1b818c
   81980:	call 0x17c95
   81981:	jeq r0, 0x0, +0xa <LBB384_18>

00000000000a01f0 <LBB384_17>:
   81982:	mov64 r3, r10
   81983:	add64 r3, -0x1
   81984:	lddw r1, 0x1b82fc
   81986:	mov64 r2, 0x37
   81987:	lddw r4, 0x1bfba0
   81989:	lddw r5, 0x1bfbc0
   81991:	call 0x21de2

00000000000a0240 <LBB384_18>:
   81992:	ldxdw r1, [r10 - 0x100]
   81993:	stxdw [r10 - 0x60], r1
   81994:	ldxdw r1, [r10 - 0x108]
   81995:	stxdw [r10 - 0x68], r1
   81996:	ldxdw r1, [r10 - 0x110]
   81997:	stxdw [r10 - 0x70], r1
   81998:	ldxdw r1, [r10 - 0x130]
   81999:	stxdw [r10 - 0x88], r1
   82000:	ldxdw r1, [r10 - 0x128]
   82001:	stxdw [r10 - 0x80], r1
   82002:	ldxdw r1, [r10 - 0x120]
   82003:	stxdw [r10 - 0x78], r1
   82004:	lddw r1, 0x1b957a
   82006:	stxdw [r10 - 0xa0], r1
   82007:	stw [r10 - 0x10], 0x1784
   82008:	stb [r10 - 0x58], 0x2
   82009:	stw [r10 - 0x90], 0x321
   82010:	stdw [r10 - 0x98], 0x1d
   82011:	stdw [r10 - 0xa8], 0x0
   82012:	mov64 r1, r10
   82013:	add64 r1, -0x1c0
   82014:	mov64 r2, r10
   82015:	add64 r2, -0xa8
   82016:	call 0x1fb6c
   82017:	ldxdw r3, [r10 - 0x1b8]
   82018:	ldxdw r2, [r10 - 0x1c0]
   82019:	mov64 r1, r10
   82020:	add64 r1, -0x1d0
   82021:	mov64 r4, 0x0
   82022:	call -0x13e31
   82023:	ldxdw r6, [r10 - 0x1c8]
   82024:	ldxdw r7, [r10 - 0x1d0]
   82025:	ja +0x55 <LBB384_48>

00000000000a0350 <LBB384_19>:
   82026:	mov64 r1, r10
   82027:	add64 r1, -0xa8
   82028:	mov64 r2, r8
   82029:	call 0x9f7
   82030:	ldxdw r1, [r10 - 0xa0]
   82031:	jeq r1, 0x2, +0x1 <LBB384_24>
   82032:	ja +0x26 <LBB384_23>

00000000000a0388 <LBB384_24>:
   82033:	ldxdw r6, [r10 - 0x90]
   82034:	ldxdw r7, [r10 - 0x98]
   82035:	ja +0x4b <LBB384_48>

00000000000a03a0 <LBB384_22>:
   82036:	ldxdw r1, [r10 - 0x100]
   82037:	stxdw [r10 - 0x60], r1
   82038:	ldxdw r1, [r10 - 0x108]
   82039:	stxdw [r10 - 0x68], r1
   82040:	ldxdw r1, [r10 - 0x110]
   82041:	stxdw [r10 - 0x70], r1
   82042:	ldxdw r1, [r10 - 0x130]
   82043:	stxdw [r10 - 0x88], r1
   82044:	ldxdw r1, [r10 - 0x128]
   82045:	stxdw [r10 - 0x80], r1
   82046:	ldxdw r1, [r10 - 0x120]
   82047:	stxdw [r10 - 0x78], r1
   82048:	lddw r1, 0x1b957a
   82050:	stxdw [r10 - 0xa0], r1
   82051:	stw [r10 - 0x10], 0x1785
   82052:	stb [r10 - 0x58], 0x2
   82053:	stw [r10 - 0x90], 0x322
   82054:	stdw [r10 - 0x98], 0x1d
   82055:	stdw [r10 - 0xa8], 0x0
   82056:	mov64 r1, r10
   82057:	add64 r1, -0x1a0
   82058:	mov64 r2, r10
   82059:	add64 r2, -0xa8
   82060:	call 0x1fb40
   82061:	ldxdw r3, [r10 - 0x198]
   82062:	ldxdw r2, [r10 - 0x1a0]
   82063:	mov64 r1, r10
   82064:	add64 r1, -0x1b0
   82065:	mov64 r4, r6
   82066:	mov64 r5, r7
   82067:	call -0x13d0c
   82068:	ldxdw r6, [r10 - 0x1a8]
   82069:	ldxdw r7, [r10 - 0x1b0]
   82070:	ja +0x28 <LBB384_48>

00000000000a04b8 <LBB384_23>:
   82071:	ldxb r2, [r10 - 0xa8]
   82072:	stxdw [r10 - 0x1f8], r2
   82073:	ldxdw r2, [r10 - 0x98]
   82074:	ldxdw r3, [r10 - 0x90]
   82075:	ldxdw r4, [r10 - 0x88]
   82076:	stxdw [r10 - 0x118], r4
   82077:	stxdw [r10 - 0x120], r3
   82078:	stxdw [r10 - 0x128], r2
   82079:	stxdw [r10 - 0x130], r1
   82080:	ldxdw r2, [r8 + 0x28]
   82081:	add64 r2, 0x8
   82082:	mov64 r1, r10
   82083:	add64 r1, -0xa8
   82084:	mov64 r3, r7
   82085:	call 0x22db
   82086:	mov64 r9, r7
   82087:	ldxdw r7, [r10 - 0xa0]
   82088:	ldxdw r1, [r10 - 0xa8]
   82089:	jeq r1, 0x0, +0x2 <LBB384_25>
   82090:	ldxdw r6, [r10 - 0x98]
   82091:	ja +0x13 <LBB384_48>

00000000000a0560 <LBB384_25>:
   82092:	ldxdw r1, [r10 - 0x1f8]
   82093:	ldxdw r1, [r10 - 0x98]
   82094:	jeq r1, 0x0, +0x6 <LBB384_27>
   82095:	mov64 r1, r10
   82096:	add64 r1, -0x160
   82097:	call 0xe7
   82098:	ldxdw r6, [r10 - 0x158]
   82099:	ldxdw r7, [r10 - 0x160]
   82100:	ja +0xa <LBB384_48>

00000000000a05a8 <LBB384_27>:
   82101:	mov64 r1, r10
   82102:	add64 r1, -0xa8
   82103:	mov64 r2, r8
   82104:	mov64 r3, r7
   82105:	call -0xc2f
   82106:	ldxdw r4, [r10 - 0xa0]
   82107:	ldxdw r1, [r10 - 0xa8]
   82108:	jeq r1, 0x0, +0x6 <LBB384_29>
   82109:	ldxdw r6, [r10 - 0x98]
   82110:	mov64 r7, r4

00000000000a05f8 <LBB384_48>:
   82111:	ldxdw r1, [r10 - 0x1d8]
   82112:	stxdw [r1 + 0x8], r6
   82113:	stxdw [r1 + 0x0], r7
   82114:	exit

00000000000a0618 <LBB384_29>:
   82115:	ldxdw r5, [r10 - 0x1f8]
   82116:	and64 r5, 0x1
   82117:	ldxdw r0, [r10 - 0x98]
   82118:	ldxdw r1, [r10 - 0x90]
   82119:	ldxdw r2, [r10 - 0x88]
   82120:	stxdw [r10 - 0xf8], r2
   82121:	stxdw [r10 - 0x100], r1
   82122:	stxdw [r10 - 0x110], r4
   82123:	stxdw [r10 - 0x108], r0
   82124:	mov64 r1, 0x0
   82125:	ldxdw r2, [r10 - 0x1f0]
   82126:	stxdw [r10 - 0x200], r4
   82127:	jne r2, 0x0, +0x1 <LBB384_31>
   82128:	ja +0x30 <LBB384_33>

00000000000a0688 <LBB384_31>:
   82129:	stxdw [r10 - 0x208], r0
   82130:	ldxdw r1, [r8 + 0x30]
   82131:	ldxdw r4, [r1 + 0x68]
   82132:	ldxdw r1, [r8 + 0x0]
   82133:	ldxdw r3, [r1 + 0x410]
   82134:	ldxdw r1, [r8 + 0x28]
   82135:	ldxdw r2, [r1 + 0x60]
   82136:	stxdw [r10 - 0xff8], r6
   82137:	stxdw [r10 - 0xff0], r7
   82138:	stxdw [r10 - 0x1000], r5
   82139:	mov64 r1, r10
   82140:	add64 r1, -0xa8
   82141:	mov64 r6, r5
   82142:	mov64 r5, r10
   82143:	call -0xb02
   82144:	ldxdw r3, [r10 - 0xa0]
   82145:	ldxdw r1, [r10 - 0xa8]
   82146:	jeq r1, 0x0, +0x3 <LBB384_36>
   82147:	ldxdw r6, [r10 - 0x98]
   82148:	mov64 r7, r3
   82149:	ja -0x27 <LBB384_48>

00000000000a0730 <LBB384_36>:
   82150:	stxdw [r10 - 0x1f8], r6
   82151:	ldxdw r4, [r10 - 0x98]
   82152:	mov64 r1, r10
   82153:	add64 r1, -0xa8
   82154:	mov64 r2, r8
   82155:	ldxdw r5, [r10 - 0x1f0]
   82156:	call -0x9d5
   82157:	ldxdw r6, [r10 - 0x98]
   82158:	ldxdw r2, [r10 - 0xa0]
   82159:	ldxdw r1, [r10 - 0xa8]
   82160:	jeq r1, 0x0, +0x2 <LBB384_32>
   82161:	mov64 r7, r2
   82162:	ja -0x34 <LBB384_48>

00000000000a0798 <LBB384_32>:
   82163:	mov64 r1, r10
   82164:	add64 r1, -0xd8
   82165:	stxdw [r10 - 0x210], r2
   82166:	mov64 r2, r10
   82167:	add64 r2, -0x90
   82168:	mov64 r3, 0x30
   82169:	call 0x22a2f
   82170:	stxdw [r10 - 0xe0], r6
   82171:	ldxdw r1, [r10 - 0x210]
   82172:	stxdw [r10 - 0xe8], r1
   82173:	mov64 r1, 0x1
   82174:	ldxdw r5, [r10 - 0x1f8]
   82175:	ldxdw r4, [r10 - 0x200]
   82176:	ldxdw r0, [r10 - 0x208]

00000000000a0808 <LBB384_33>:
   82177:	stxdw [r10 - 0x1f8], r5
   82178:	mov64 r5, r10
   82179:	add64 r5, -0xe8
   82180:	ldxdw r2, [r10 - 0x1f0]
   82181:	jne r2, 0x0, +0x1 <LBB384_35>
   82182:	mov64 r5, 0x0

00000000000a0838 <LBB384_35>:
   82183:	stxdw [r10 - 0x1f0], r5
   82184:	stxdw [r10 - 0xf0], r1
   82185:	ldxdw r1, [r8 + 0x28]
   82186:	ldxb r3, [r1 + 0xa2]
   82187:	ldxdw r1, [r8 + 0x0]
   82188:	ldxdw r2, [r1 + 0x420]
   82189:	stxdw [r10 - 0xff0], r0
   82190:	stxdw [r10 - 0xff8], r4
   82191:	stxdw [r10 - 0x1000], r7
   82192:	stxdw [r10 - 0xfe8], r5
   82193:	mov64 r1, r10
   82194:	add64 r1, -0xa8
   82195:	mov64 r4, r10
   82196:	add64 r4, -0x130
   82197:	mov64 r5, r10
   82198:	mov64 r6, r0
   82199:	call -0xe1a
   82200:	ldxdw r2, [r10 - 0xa0]
   82201:	ldxdw r1, [r10 - 0xa8]
   82202:	jeq r1, 0x0, +0x3 <LBB384_39>
   82203:	ldxdw r6, [r10 - 0x98]
   82204:	mov64 r7, r2
   82205:	ja -0x5f <LBB384_48>

00000000000a08f0 <LBB384_39>:
   82206:	ldxdw r1, [r10 - 0x1f0]
   82207:	stxdw [r10 - 0x208], r6
   82208:	ldxdw r1, [r10 - 0x200]
   82209:	ldxdw r1, [r10 - 0x90]
   82210:	stxdw [r10 - 0x218], r1
   82211:	ldxdw r3, [r10 - 0x98]
   82212:	mov64 r1, r10
   82213:	add64 r1, -0xa8
   82214:	stxdw [r10 - 0x210], r2
   82215:	mov64 r6, r3
   82216:	call -0xce9
   82217:	ldxdw r1, [r10 - 0xa8]
   82218:	jeq r1, 0x2, +0x1 <LBB384_41>
   82219:	ja +0x2f <LBB384_42>

00000000000a0960 <LBB384_41>:
   82220:	ldxdw r1, [r10 - 0xa0]
   82221:	ldxdw r2, [r10 - 0x1e0]
   82222:	jgt r1, r2, +0x1 <LBB384_44>
   82223:	ja +0x2d <LBB384_43>

00000000000a0980 <LBB384_44>:
   82224:	mov64 r1, r10
   82225:	add64 r1, -0x88
   82226:	lddw r2, 0x1b81c8
   82228:	call 0x16e3c
   82229:	mov64 r1, r10
   82230:	add64 r1, -0x70
   82231:	lddw r2, 0x1b81c8
   82233:	call -0x12bbf
   82234:	lddw r1, 0x1b957a
   82236:	stxdw [r10 - 0xa0], r1
   82237:	stb [r10 - 0x58], 0x2
   82238:	stw [r10 - 0x90], 0x34a
   82239:	stdw [r10 - 0x98], 0x1d
   82240:	stdw [r10 - 0xa8], 0x0
   82241:	stw [r10 - 0x10], 0x1772
   82242:	mov64 r1, r10
   82243:	add64 r1, -0x180
   82244:	mov64 r2, r10
   82245:	add64 r2, -0xa8
   82246:	call 0x1fa86
   82247:	ldxdw r9, [r10 - 0x178]
   82248:	ldxdw r8, [r10 - 0x180]
   82249:	mov64 r1, r10
   82250:	add64 r1, -0xa8
   82251:	ldxdw r2, [r10 - 0x210]
   82252:	mov64 r3, r6
   82253:	call -0xd0e
   82254:	ldxdw r7, [r10 - 0xa8]
   82255:	jeq r7, 0x2, +0x1 <LBB384_49>
   82256:	ja +0x28 <LBB384_50>

00000000000a0a88 <LBB384_49>:
   82257:	ldxdw r5, [r10 - 0xa0]
   82258:	mov64 r1, r10
   82259:	add64 r1, -0x190
   82260:	mov64 r2, r8
   82261:	mov64 r3, r9
   82262:	ldxdw r4, [r10 - 0x1e0]
   82263:	call -0x13dd0
   82264:	ldxdw r6, [r10 - 0x188]
   82265:	ldxdw r7, [r10 - 0x190]
   82266:	ja -0x9c <LBB384_48>

00000000000a0ad8 <LBB384_42>:
   82267:	ldxdw r6, [r10 - 0xa0]
   82268:	ja +0x1a <LBB384_47>

00000000000a0ae8 <LBB384_43>:
   82269:	ldxdw r1, [r10 - 0x1e8]
   82270:	ldxb r3, [r1 + 0x21]
   82271:	stxdw [r10 - 0xfd0], r6
   82272:	mov64 r1, r10
   82273:	add64 r1, -0x130
   82274:	stxdw [r10 - 0xfc8], r1
   82275:	ldxdw r1, [r10 - 0x210]
   82276:	stxdw [r10 - 0xfd8], r1
   82277:	ldxdw r1, [r10 - 0x1f0]
   82278:	stxdw [r10 - 0xfe0], r1
   82279:	ldxdw r1, [r10 - 0x208]
   82280:	stxdw [r10 - 0xfe8], r1
   82281:	ldxdw r1, [r10 - 0x200]
   82282:	stxdw [r10 - 0xff0], r1
   82283:	stxdw [r10 - 0xff8], r7
   82284:	stxdw [r10 - 0x1000], r9
   82285:	mov64 r1, r10
   82286:	add64 r1, -0xa8
   82287:	mov64 r5, r10
   82288:	mov64 r2, r8
   82289:	ldxdw r4, [r10 - 0x1f8]
   82290:	call -0x3dc
   82291:	ldxdw r1, [r10 - 0xa0]
   82292:	ldxdw r2, [r10 - 0xa8]
   82293:	jeq r2, 0x0, +0x8 <LBB384_45>
   82294:	ldxdw r6, [r10 - 0x98]

00000000000a0bb8 <LBB384_47>:
   82295:	mov64 r7, r1
   82296:	ja -0xba <LBB384_48>

00000000000a0bc8 <LBB384_50>:
   82297:	ldxdw r6, [r10 - 0xa0]
   82298:	mov64 r1, r8
   82299:	mov64 r2, r9
   82300:	call -0x12b3b
   82301:	ja -0xbf <LBB384_48>

00000000000a0bf0 <LBB384_45>:
   82302:	ldxdw r2, [r10 - 0x98]
   82303:	ldxdw r3, [r10 - 0x1e8]
   82304:	ldxb r3, [r3 + 0x24]
   82305:	mov64 r4, r10
   82306:	add64 r4, -0xf0
   82307:	stxdw [r10 - 0xfd0], r4
   82308:	stxdw [r10 - 0xfc8], r2
   82309:	lddw r2, 0x1b8b5b
   82311:	stxdw [r10 - 0xfe0], r2
   82312:	ldxdw r2, [r10 - 0x218]
   82313:	stxdw [r10 - 0xfe8], r2
   82314:	stxdw [r10 - 0xff0], r1
   82315:	mov64 r1, r10
   82316:	add64 r1, -0x110
   82317:	stxdw [r10 - 0xff8], r1
   82318:	stxdw [r10 - 0x1000], r7
   82319:	stdw [r10 - 0xfd8], 0x3
   82320:	mov64 r1, r10
   82321:	add64 r1, -0x170
   82322:	mov64 r5, r10
   82323:	mov64 r2, r8
   82324:	mov64 r4, r9
   82325:	call -0x9cc
   82326:	ldxdw r6, [r10 - 0x168]
   82327:	ldxdw r7, [r10 - 0x170]
   82328:	ja -0xda <LBB384_48>
