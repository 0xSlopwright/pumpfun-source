
/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol/costs-parent/symbols.so:	file format elf64-sbf

Disassembly of section .text:

000000000009fe18 <_ZN14pump_recovered5trade3buy17h8ba47e197d5a9d68E>:
   81859:	mov64 r6, r5
   81860:	stxdw [r10 - 0x1d8], r4
   81861:	mov64 r9, r3
   81862:	stxdw [r10 - 0x1d0], r1
   81863:	stxdw [r10 - 0x1e0], r2
   81864:	ldxdw r8, [r2 + 0x8]
   81865:	ldxdw r2, [r8 + 0x28]
   81866:	mov64 r3, r8
   81867:	add64 r3, 0x70
   81868:	mov64 r4, r8
   81869:	add64 r4, 0x40
   81870:	mov64 r1, r10
   81871:	add64 r1, -0x138
   81872:	call 0x1d3a
   81873:	ldxdw r7, [r10 - 0x138]
   81874:	jne r7, 0x2, +0x4f <LBB384_2>
   81875:	ldxdw r1, [r8 + 0x28]
   81876:	ldxb r3, [r1 + 0xa3]
   81877:	ldxb r2, [r1 + 0xa1]
   81878:	mov64 r1, r10
   81879:	add64 r1, -0x148
   81880:	mov64 r4, 0x0
   81881:	stxdw [r10 - 0x1e8], r4
   81882:	call -0x1049
   81883:	ldxdw r7, [r10 - 0x148]
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
   81907:	call 0x22b47
   81908:	mov64 r4, r7
   81909:	jle r9, r4, +0x6 <LBB384_8>
   81910:	lsh64 r0, 0x20
   81911:	rsh64 r0, 0x20
   81912:	jeq r0, 0x0, +0x3 <LBB384_8>
   81913:	mov64 r1, r9
   81914:	sub64 r1, r4
   81915:	stxdw [r10 - 0x1e8], r1

000000000009ffe0 <LBB384_8>:
   81916:	mov64 r1, r4
   81917:	ldxdw r2, [r10 - 0x1e8]
   81918:	jne r2, 0x0, +0x1 <LBB384_10>
   81919:	mov64 r1, r9

00000000000a0000 <LBB384_10>:
   81920:	mov64 r7, r4
   81921:	jne r6, 0x0, +0x1 <LBB384_12>
   81922:	mov64 r7, r1

00000000000a0018 <LBB384_12>:
   81923:	jge r9, r4, +0x1 <LBB384_14>
   81924:	mov64 r7, r1

00000000000a0028 <LBB384_14>:
   81925:	jeq r7, 0x0, +0x20 <LBB384_16>
   81926:	mov64 r6, r4
   81927:	jlt r4, r7, +0x1 <LBB384_20>
   81928:	ja +0x61 <LBB384_19>

00000000000a0048 <LBB384_20>:
   81929:	mov64 r1, r10
   81930:	add64 r1, -0x128
   81931:	lddw r2, 0x1b82c0
   81933:	call 0x16f68
   81934:	stdw [r10 - 0x100], 0x0
   81935:	stdw [r10 - 0x108], 0x1
   81936:	stdw [r10 - 0x110], 0x0
   81937:	lddw r1, 0x1bfb98
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
   81949:	lddw r1, 0x1b82c0
   81951:	call 0x17cb7
   81952:	jeq r0, 0x0, +0x53 <LBB384_22>
   81953:	ja +0x1c <LBB384_17>

00000000000a0110 <LBB384_2>:
   81954:	ldxdw r6, [r10 - 0x130]
   81955:	ja +0x9b <LBB384_48>

00000000000a0120 <LBB384_4>:
   81956:	ldxdw r6, [r10 - 0x140]
   81957:	ja +0x99 <LBB384_48>

00000000000a0130 <LBB384_16>:
   81958:	mov64 r1, r10
   81959:	add64 r1, -0x128
   81960:	lddw r2, 0x1b81b4
   81962:	call 0x16f4b
   81963:	stdw [r10 - 0x100], 0x0
   81964:	stdw [r10 - 0x108], 0x1
   81965:	stdw [r10 - 0x110], 0x0
   81966:	lddw r1, 0x1bfb98
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
   81978:	lddw r1, 0x1b81b4
   81980:	call 0x17c9a
   81981:	jeq r0, 0x0, +0xa <LBB384_18>

00000000000a01f0 <LBB384_17>:
   81982:	mov64 r3, r10
   81983:	add64 r3, -0x1
   81984:	lddw r1, 0x1b8324
   81986:	mov64 r2, 0x37
   81987:	lddw r4, 0x1bfbc8
   81989:	lddw r5, 0x1bfbe8
   81991:	call 0x21de7

00000000000a0240 <LBB384_18>:
   81992:	ldxdw r1, [r10 - 0x100]
   81993:	stxdw [r10 - 0x60], r1
   81994:	ldxdw r1, [r10 - 0x108]
   81995:	stxdw [r10 - 0x68], r1
   81996:	ldxdw r1, [r10 - 0x110]
   81997:	stxdw [r10 - 0x70], r1
   81998:	ldxdw r1, [r10 - 0x128]
   81999:	stxdw [r10 - 0x88], r1
   82000:	ldxdw r1, [r10 - 0x120]
   82001:	stxdw [r10 - 0x80], r1
   82002:	ldxdw r1, [r10 - 0x118]
   82003:	stxdw [r10 - 0x78], r1
   82004:	lddw r1, 0x1b95a2
   82006:	stxdw [r10 - 0xa0], r1
   82007:	stw [r10 - 0x10], 0x1784
   82008:	stb [r10 - 0x58], 0x2
   82009:	stw [r10 - 0x90], 0x321
   82010:	stdw [r10 - 0x98], 0x1d
   82011:	stdw [r10 - 0xa8], 0x0
   82012:	mov64 r1, r10
   82013:	add64 r1, -0x1b8
   82014:	mov64 r2, r10
   82015:	add64 r2, -0xa8
   82016:	call 0x1fb71
   82017:	ldxdw r3, [r10 - 0x1b0]
   82018:	ldxdw r2, [r10 - 0x1b8]
   82019:	mov64 r1, r10
   82020:	add64 r1, -0x1c8
   82021:	mov64 r4, 0x0
   82022:	call -0x13e31
   82023:	ldxdw r6, [r10 - 0x1c0]
   82024:	ldxdw r7, [r10 - 0x1c8]
   82025:	ja +0x55 <LBB384_48>

00000000000a0350 <LBB384_19>:
   82026:	mov64 r1, r10
   82027:	add64 r1, -0xa8
   82028:	mov64 r2, r8
   82029:	call 0x9fc
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
   82042:	ldxdw r1, [r10 - 0x128]
   82043:	stxdw [r10 - 0x88], r1
   82044:	ldxdw r1, [r10 - 0x120]
   82045:	stxdw [r10 - 0x80], r1
   82046:	ldxdw r1, [r10 - 0x118]
   82047:	stxdw [r10 - 0x78], r1
   82048:	lddw r1, 0x1b95a2
   82050:	stxdw [r10 - 0xa0], r1
   82051:	stw [r10 - 0x10], 0x1785
   82052:	stb [r10 - 0x58], 0x2
   82053:	stw [r10 - 0x90], 0x322
   82054:	stdw [r10 - 0x98], 0x1d
   82055:	stdw [r10 - 0xa8], 0x0
   82056:	mov64 r1, r10
   82057:	add64 r1, -0x198
   82058:	mov64 r2, r10
   82059:	add64 r2, -0xa8
   82060:	call 0x1fb45
   82061:	ldxdw r3, [r10 - 0x190]
   82062:	ldxdw r2, [r10 - 0x198]
   82063:	mov64 r1, r10
   82064:	add64 r1, -0x1a8
   82065:	mov64 r4, r6
   82066:	mov64 r5, r7
   82067:	call -0x13d0c
   82068:	ldxdw r6, [r10 - 0x1a0]
   82069:	ldxdw r7, [r10 - 0x1a8]
   82070:	ja +0x28 <LBB384_48>

00000000000a04b8 <LBB384_23>:
   82071:	ldxb r2, [r10 - 0xa8]
   82072:	stxdw [r10 - 0x1f0], r2
   82073:	ldxdw r2, [r10 - 0x98]
   82074:	ldxdw r3, [r10 - 0x90]
   82075:	ldxdw r4, [r10 - 0x88]
   82076:	stxdw [r10 - 0xf8], r4
   82077:	stxdw [r10 - 0x100], r3
   82078:	stxdw [r10 - 0x108], r2
   82079:	stxdw [r10 - 0x110], r1
   82080:	ldxdw r2, [r8 + 0x28]
   82081:	add64 r2, 0x8
   82082:	mov64 r1, r10
   82083:	add64 r1, -0xa8
   82084:	mov64 r3, r7
   82085:	call 0x22e0
   82086:	mov64 r9, r7
   82087:	ldxdw r7, [r10 - 0xa0]
   82088:	ldxdw r1, [r10 - 0xa8]
   82089:	jeq r1, 0x0, +0x2 <LBB384_25>
   82090:	ldxdw r6, [r10 - 0x98]
   82091:	ja +0x13 <LBB384_48>

00000000000a0560 <LBB384_25>:
   82092:	ldxdw r1, [r10 - 0x1f0]
   82093:	ldxdw r1, [r10 - 0x98]
   82094:	jeq r1, 0x0, +0x6 <LBB384_27>
   82095:	mov64 r1, r10
   82096:	add64 r1, -0x158
   82097:	call 0xec
   82098:	ldxdw r6, [r10 - 0x150]
   82099:	ldxdw r7, [r10 - 0x158]
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
   82111:	ldxdw r1, [r10 - 0x1d0]
   82112:	stxdw [r1 + 0x8], r6
   82113:	stxdw [r1 + 0x0], r7
   82114:	exit

00000000000a0618 <LBB384_29>:
   82115:	ldxdw r5, [r10 - 0x1f0]
   82116:	and64 r5, 0x1
   82117:	ldxdw r1, [r10 - 0x88]
   82118:	stxdw [r10 - 0x208], r1
   82119:	ldxdw r1, [r10 - 0x90]
   82120:	stxdw [r10 - 0x200], r1
   82121:	ldxdw r0, [r10 - 0x98]
   82122:	mov64 r1, 0x0
   82123:	ldxdw r2, [r10 - 0x1e8]
   82124:	stxdw [r10 - 0x1f8], r4
   82125:	jne r2, 0x0, +0x1 <LBB384_31>
   82126:	ja +0x30 <LBB384_33>

00000000000a0678 <LBB384_31>:
   82127:	stxdw [r10 - 0x210], r0
   82128:	ldxdw r1, [r8 + 0x30]
   82129:	ldxdw r4, [r1 + 0x68]
   82130:	ldxdw r1, [r8 + 0x0]
   82131:	ldxdw r3, [r1 + 0x410]
   82132:	ldxdw r1, [r8 + 0x28]
   82133:	ldxdw r2, [r1 + 0x60]
   82134:	stxdw [r10 - 0xff8], r6
   82135:	stxdw [r10 - 0xff0], r7
   82136:	stxdw [r10 - 0x1000], r5
   82137:	mov64 r1, r10
   82138:	add64 r1, -0xa8
   82139:	mov64 r6, r5
   82140:	mov64 r5, r10
   82141:	call -0xb00
   82142:	ldxdw r3, [r10 - 0xa0]
   82143:	ldxdw r1, [r10 - 0xa8]
   82144:	jeq r1, 0x0, +0x3 <LBB384_36>
   82145:	ldxdw r6, [r10 - 0x98]
   82146:	mov64 r7, r3
   82147:	ja -0x25 <LBB384_48>

00000000000a0720 <LBB384_36>:
   82148:	stxdw [r10 - 0x1f0], r6
   82149:	ldxdw r4, [r10 - 0x98]
   82150:	mov64 r1, r10
   82151:	add64 r1, -0xa8
   82152:	mov64 r2, r8
   82153:	ldxdw r5, [r10 - 0x1e8]
   82154:	call -0x9d3
   82155:	ldxdw r6, [r10 - 0x98]
   82156:	ldxdw r2, [r10 - 0xa0]
   82157:	ldxdw r1, [r10 - 0xa8]
   82158:	jeq r1, 0x0, +0x2 <LBB384_32>
   82159:	mov64 r7, r2
   82160:	ja -0x32 <LBB384_48>

00000000000a0788 <LBB384_32>:
   82161:	mov64 r1, r10
   82162:	add64 r1, -0xd8
   82163:	stxdw [r10 - 0x218], r2
   82164:	mov64 r2, r10
   82165:	add64 r2, -0x90
   82166:	mov64 r3, 0x30
   82167:	call 0x22a36
   82168:	stxdw [r10 - 0xe0], r6
   82169:	ldxdw r1, [r10 - 0x218]
   82170:	stxdw [r10 - 0xe8], r1
   82171:	mov64 r1, 0x1
   82172:	ldxdw r5, [r10 - 0x1f0]
   82173:	ldxdw r4, [r10 - 0x1f8]
   82174:	ldxdw r0, [r10 - 0x210]

00000000000a07f8 <LBB384_33>:
   82175:	stxdw [r10 - 0x1f0], r5
   82176:	mov64 r5, r10
   82177:	add64 r5, -0xe8
   82178:	ldxdw r2, [r10 - 0x1e8]
   82179:	jne r2, 0x0, +0x1 <LBB384_35>
   82180:	mov64 r5, 0x0

00000000000a0828 <LBB384_35>:
   82181:	stxdw [r10 - 0x1e8], r5
   82182:	stxdw [r10 - 0xf0], r1
   82183:	ldxdw r1, [r8 + 0x28]
   82184:	ldxb r3, [r1 + 0xa2]
   82185:	ldxdw r1, [r8 + 0x0]
   82186:	ldxdw r2, [r1 + 0x420]
   82187:	stxdw [r10 - 0xff0], r0
   82188:	stxdw [r10 - 0xff8], r4
   82189:	stxdw [r10 - 0x1000], r7
   82190:	stxdw [r10 - 0xfe8], r5
   82191:	mov64 r1, r10
   82192:	add64 r1, -0xa8
   82193:	mov64 r4, r10
   82194:	add64 r4, -0x110
   82195:	mov64 r5, r10
   82196:	mov64 r6, r0
   82197:	call -0xe18
   82198:	ldxdw r2, [r10 - 0xa0]
   82199:	ldxdw r1, [r10 - 0xa8]
   82200:	jeq r1, 0x0, +0x3 <LBB384_39>
   82201:	ldxdw r6, [r10 - 0x98]
   82202:	mov64 r7, r2
   82203:	ja -0x5d <LBB384_48>

00000000000a08e0 <LBB384_39>:
   82204:	ldxdw r1, [r10 - 0x1e8]
   82205:	stxdw [r10 - 0x210], r6
   82206:	ldxdw r1, [r10 - 0x1f8]
   82207:	ldxdw r1, [r10 - 0x90]
   82208:	stxdw [r10 - 0x220], r1
   82209:	ldxdw r3, [r10 - 0x98]
   82210:	mov64 r1, r10
   82211:	add64 r1, -0xa8
   82212:	stxdw [r10 - 0x218], r2
   82213:	mov64 r6, r3
   82214:	call -0xce7
   82215:	ldxdw r1, [r10 - 0xa8]
   82216:	jeq r1, 0x2, +0x1 <LBB384_41>
   82217:	ja +0x2f <LBB384_42>

00000000000a0950 <LBB384_41>:
   82218:	ldxdw r1, [r10 - 0xa0]
   82219:	ldxdw r2, [r10 - 0x1d8]
   82220:	jgt r1, r2, +0x1 <LBB384_44>
   82221:	ja +0x2d <LBB384_43>

00000000000a0970 <LBB384_44>:
   82222:	mov64 r1, r10
   82223:	add64 r1, -0x88
   82224:	lddw r2, 0x1b81f0
   82226:	call 0x16e43
   82227:	mov64 r1, r10
   82228:	add64 r1, -0x70
   82229:	lddw r2, 0x1b81f0
   82231:	call -0x12bbd
   82232:	lddw r1, 0x1b95a2
   82234:	stxdw [r10 - 0xa0], r1
   82235:	stb [r10 - 0x58], 0x2
   82236:	stw [r10 - 0x90], 0x34a
   82237:	stdw [r10 - 0x98], 0x1d
   82238:	stdw [r10 - 0xa8], 0x0
   82239:	stw [r10 - 0x10], 0x1772
   82240:	mov64 r1, r10
   82241:	add64 r1, -0x178
   82242:	mov64 r2, r10
   82243:	add64 r2, -0xa8
   82244:	call 0x1fa8d
   82245:	ldxdw r9, [r10 - 0x170]
   82246:	ldxdw r8, [r10 - 0x178]
   82247:	mov64 r1, r10
   82248:	add64 r1, -0xa8
   82249:	ldxdw r2, [r10 - 0x218]
   82250:	mov64 r3, r6
   82251:	call -0xd0c
   82252:	ldxdw r7, [r10 - 0xa8]
   82253:	jeq r7, 0x2, +0x1 <LBB384_49>
   82254:	ja +0x28 <LBB384_50>

00000000000a0a78 <LBB384_49>:
   82255:	ldxdw r5, [r10 - 0xa0]
   82256:	mov64 r1, r10
   82257:	add64 r1, -0x188
   82258:	mov64 r2, r8
   82259:	mov64 r3, r9
   82260:	ldxdw r4, [r10 - 0x1d8]
   82261:	call -0x13dce
   82262:	ldxdw r6, [r10 - 0x180]
   82263:	ldxdw r7, [r10 - 0x188]
   82264:	ja -0x9a <LBB384_48>

00000000000a0ac8 <LBB384_42>:
   82265:	ldxdw r6, [r10 - 0xa0]
   82266:	ja +0x1a <LBB384_47>

00000000000a0ad8 <LBB384_43>:
   82267:	ldxdw r1, [r10 - 0x1e0]
   82268:	ldxb r3, [r1 + 0x21]
   82269:	stxdw [r10 - 0xfd0], r6
   82270:	mov64 r1, r10
   82271:	add64 r1, -0x110
   82272:	stxdw [r10 - 0xfc8], r1
   82273:	ldxdw r1, [r10 - 0x218]
   82274:	stxdw [r10 - 0xfd8], r1
   82275:	ldxdw r1, [r10 - 0x1e8]
   82276:	stxdw [r10 - 0xfe0], r1
   82277:	ldxdw r1, [r10 - 0x210]
   82278:	stxdw [r10 - 0xfe8], r1
   82279:	ldxdw r6, [r10 - 0x1f8]
   82280:	stxdw [r10 - 0xff0], r6
   82281:	stxdw [r10 - 0xff8], r7
   82282:	stxdw [r10 - 0x1000], r9
   82283:	mov64 r1, r10
   82284:	add64 r1, -0xa8
   82285:	mov64 r5, r10
   82286:	mov64 r2, r8
   82287:	ldxdw r4, [r10 - 0x1f0]
   82288:	call -0x3da
   82289:	ldxdw r1, [r10 - 0xa0]
   82290:	ldxdw r2, [r10 - 0xa8]
   82291:	jeq r2, 0x0, +0x8 <LBB384_45>
   82292:	ldxdw r6, [r10 - 0x98]

00000000000a0ba8 <LBB384_47>:
   82293:	mov64 r7, r1
   82294:	ja -0xb8 <LBB384_48>

00000000000a0bb8 <LBB384_50>:
   82295:	ldxdw r6, [r10 - 0xa0]
   82296:	mov64 r1, r8
   82297:	mov64 r2, r9
   82298:	call -0x12b39
   82299:	ja -0xbd <LBB384_48>

00000000000a0be0 <LBB384_45>:
   82300:	ldxdw r2, [r10 - 0x98]
   82301:	ldxdw r3, [r10 - 0x208]
   82302:	stxdw [r10 - 0x90], r3
   82303:	ldxdw r3, [r10 - 0x200]
   82304:	stxdw [r10 - 0x98], r3
   82305:	ldxdw r3, [r10 - 0x210]
   82306:	stxdw [r10 - 0xa0], r3
   82307:	stxdw [r10 - 0xa8], r6
   82308:	ldxdw r3, [r10 - 0x1e0]
   82309:	ldxb r3, [r3 + 0x24]
   82310:	mov64 r4, r10
   82311:	add64 r4, -0xf0
   82312:	stxdw [r10 - 0xfd0], r4
   82313:	stxdw [r10 - 0xfc8], r2
   82314:	lddw r2, 0x1b8b83
   82316:	stxdw [r10 - 0xfe0], r2
   82317:	ldxdw r2, [r10 - 0x220]
   82318:	stxdw [r10 - 0xfe8], r2
   82319:	stxdw [r10 - 0xff0], r1
   82320:	mov64 r1, r10
   82321:	add64 r1, -0xa8
   82322:	stxdw [r10 - 0xff8], r1
   82323:	stxdw [r10 - 0x1000], r7
   82324:	stdw [r10 - 0xfd8], 0x3
   82325:	mov64 r1, r10
   82326:	add64 r1, -0x168
   82327:	mov64 r5, r10
   82328:	mov64 r2, r8
   82329:	mov64 r4, r9
   82330:	call -0x9d1
   82331:	ldxdw r6, [r10 - 0x160]
   82332:	ldxdw r7, [r10 - 0x168]
   82333:	ja -0xdf <LBB384_48>
