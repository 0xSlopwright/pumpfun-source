
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   15858:	mov64 r7, r2
   15859:	mov64 r6, r1
   15860:	ldxdw r8, [r7 + 0x8]
   15861:	ldxdw r1, [r8 + 0x10]
   15862:	ldxdw r1, [r1 + 0x0]
   15863:	ldxdw r2, [r1 + 0x18]
   15864:	stxdw [r10 - 0x10], r2
   15865:	ldxdw r2, [r1 + 0x10]
   15866:	stxdw [r10 - 0x18], r2
   15867:	ldxdw r2, [r1 + 0x8]
   15868:	stxdw [r10 - 0x20], r2
   15869:	ldxdw r1, [r1 + 0x0]
   15870:	stxdw [r10 - 0x28], r1
   15871:	ldxdw r1, [r8 + 0x0]
   15872:	add64 r1, 0x28
   15873:	stxdw [r10 - 0xc0], r1
   15874:	lddw r1, 0x11cb5b
   15876:	stxdw [r10 - 0xd0], r1
   15877:	stdw [r10 - 0xb8], 0x20
   15878:	stdw [r10 - 0xc8], 0xe
   15879:	mov64 r1, r10
   15880:	add64 r1, -0x1e0
   15881:	mov64 r2, r10
   15882:	add64 r2, -0xd0
   15883:	mov64 r3, 0x2
   15884:	stxdw [r10 - 0x228], r3
   15885:	lddw r4, 0x11e55e
   15887:	call 0x1ddfd
   15888:	ldxdw r1, [r10 - 0x1c8]
   15889:	stxdw [r10 - 0x50], r1
   15890:	ldxdw r1, [r10 - 0x1d0]
   15891:	stxdw [r10 - 0x58], r1
   15892:	ldxdw r1, [r10 - 0x1d8]
   15893:	stxdw [r10 - 0x60], r1
   15894:	ldxdw r1, [r10 - 0x1e0]
   15895:	stxdw [r10 - 0x68], r1
   15896:	mov64 r1, r10
   15897:	add64 r1, -0x28
   15898:	mov64 r2, r10
   15899:	add64 r2, -0x68
   15900:	mov64 r3, 0x20
   15901:	call 0x1f4fe
   15902:	mov64 r9, r0
   15903:	ldxdw r1, [r8 + 0x0]
   15904:	add64 r1, 0x8
   15905:	call 0x9a27
   15906:	lsh64 r9, 0x20
   15907:	rsh64 r9, 0x20
   15908:	jne r9, 0x0, +0x1e <.text+0x1f0f8>
   15909:	jne r0, 0x0, +0x1d <.text+0x1f0f8>
   15910:	ldxdw r1, [r8 + 0x8]
   15911:	ldxb r2, [r1 + 0x3b3]
   15912:	jeq r2, 0x0, +0x1a <.text+0x1f0f8>
   15913:	ldxdw r1, [r8 + 0x30]
   15914:	ldxdw r9, [r1 + 0x68]
   15915:	ldxdw r1, [r8 + 0x28]
   15916:	ldxdw r2, [r1 + 0x68]
   15917:	mov64 r1, r10
   15918:	add64 r1, -0x1e0
   15919:	mov64 r3, r9
   15920:	call -0x96
   15921:	ldxdw r2, [r10 - 0x1e0]
   15922:	jne r2, 0x2, +0xe <.text+0x1f0e8>
   15923:	ldxdw r0, [r10 - 0x1d8]
   15924:	jeq r0, 0x0, +0xe <.text+0x1f0f8>
   15925:	jge r0, r9, +0xd <.text+0x1f0f8>
   15926:	ldxdw r1, [r8 + 0x48]
   15927:	ldxdw r5, [r1 + 0x8]
   15928:	ldxdw r3, [r5 + 0x0]
   15929:	add64 r3, 0x1
   15930:	mov64 r4, 0x1
   15931:	jeq r3, 0x0, +0x1 <.text+0x1f0c8>
   15932:	mov64 r4, 0x0
   15933:	ldxdw r2, [r1 + 0x0]
   15934:	stxdw [r5 + 0x0], r3
   15935:	jne r4, 0x1, +0x7 <.text+0x1f118>
   15936:	call -0x1
   15937:	ldxdw r1, [r10 - 0x1d8]
   15938:	stxdw [r10 - 0x228], r2
   15939:	stxdw [r6 + 0x8], r1
   15940:	ldxdw r1, [r10 - 0x228]
   15941:	stxdw [r6 + 0x0], r1
   15942:	exit
   15943:	ldxdw r9, [r1 + 0x10]
   15944:	ldxdw r3, [r9 + 0x0]
   15945:	add64 r3, 0x1
   15946:	mov64 r4, 0x1
   15947:	jeq r3, 0x0, +0x1 <.text+0x1f148>
   15948:	mov64 r4, 0x0
   15949:	stxdw [r10 - 0x238], r0
   15950:	stxdw [r10 - 0x230], r5
   15951:	stxdw [r9 + 0x0], r3
   15952:	jne r4, 0x1, +0x1 <.text+0x1f170>
   15953:	ja -0x12 <.text+0x1f0e0>
   15954:	ldxdw r3, [r1 + 0x18]
   15955:	ldxdw r4, [r1 + 0x20]
   15956:	ldxb r5, [r1 + 0x28]
   15957:	ldxb r0, [r1 + 0x29]
   15958:	ldxb r1, [r1 + 0x2a]
   15959:	stxb [r10 - 0x3e], r1
   15960:	stxb [r10 - 0x3f], r0
   15961:	stxb [r10 - 0x40], r5
   15962:	stxdw [r10 - 0x48], r4
   15963:	stxdw [r10 - 0x50], r3
   15964:	stxdw [r10 - 0x240], r9
   15965:	stxdw [r10 - 0x58], r9
   15966:	ldxdw r1, [r10 - 0x230]
   15967:	stxdw [r10 - 0x60], r1
   15968:	stxdw [r10 - 0x68], r2
   15969:	ldxdw r1, [r8 + 0x0]
   15970:	ldxdw r2, [r1 + 0x0]
   15971:	ldxdw r9, [r2 + 0x8]
   15972:	ldxdw r0, [r9 + 0x0]
   15973:	add64 r0, 0x1
   15974:	mov64 r1, 0x1
   15975:	jeq r0, 0x0, +0x1 <.text+0x1f228>
   15976:	mov64 r1, 0x0
   15977:	ldxdw r3, [r8 + 0x40]
   15978:	stxdw [r10 - 0x248], r3
   15979:	ldxdw r3, [r8 + 0x30]
   15980:	ldxdw r4, [r8 + 0x20]
   15981:	ldxdw r5, [r2 + 0x0]
   15982:	stxdw [r10 - 0x250], r5
   15983:	stxdw [r9 + 0x0], r0
   15984:	jne r1, 0x1, +0x1 <.text+0x1f270>
   15985:	ja -0x32 <.text+0x1f0e0>
   15986:	ldxdw r5, [r2 + 0x10]
   15987:	ldxdw r1, [r5 + 0x0]
   15988:	add64 r1, 0x1
   15989:	mov64 r0, 0x1
   15990:	jeq r1, 0x0, +0x1 <.text+0x1f2a0>
   15991:	mov64 r0, 0x0
   15992:	stxdw [r10 - 0x260], r4
   15993:	stxdw [r10 - 0x258], r3
   15994:	stxdw [r5 + 0x0], r1
   15995:	jne r0, 0x1, +0x1 <.text+0x1f2c8>
   15996:	ja -0x3d <.text+0x1f0e0>
   15997:	ldxdw r1, [r2 + 0x18]
   15998:	ldxdw r0, [r2 + 0x20]
   15999:	ldxb r4, [r2 + 0x28]
   16000:	ldxb r3, [r2 + 0x29]
   16001:	ldxb r2, [r2 + 0x2a]
   16002:	stxb [r10 - 0xa6], r2
   16003:	stxb [r10 - 0xa7], r3
   16004:	stxb [r10 - 0xa8], r4
   16005:	stxdw [r10 - 0xb0], r0
   16006:	stxdw [r10 - 0xb8], r1
   16007:	stxdw [r10 - 0x268], r5
   16008:	stxdw [r10 - 0xc0], r5
   16009:	stxdw [r10 - 0xc8], r9
   16010:	ldxdw r1, [r10 - 0x250]
   16011:	stxdw [r10 - 0xd0], r1
   16012:	ldxdw r1, [r8 + 0x0]
   16013:	ldxh r2, [r1 + 0x118]
   16014:	stxh [r10 - 0x118], r2
   16015:	mov64 r2, r10
   16016:	add64 r2, -0x38
   16017:	ldxb r3, [r1 + 0x11a]
   16018:	stxdw [r10 - 0x190], r2
   16019:	mov64 r2, r1
   16020:	add64 r2, 0x48
   16021:	stxdw [r10 - 0x1a0], r2
   16022:	mov64 r2, r1
   16023:	add64 r2, 0x28
   16024:	stxdw [r10 - 0x1b0], r2
   16025:	add64 r1, 0x8
   16026:	stxdw [r10 - 0x1c0], r1
   16027:	mov64 r1, r10
   16028:	add64 r1, -0x118
   16029:	stxdw [r10 - 0x1d0], r1
   16030:	lddw r1, 0x11bf8c
   16032:	stxdw [r10 - 0x1e0], r1
   16033:	stxb [r10 - 0x38], r3
   16034:	mov64 r1, r10
   16035:	add64 r1, -0x1e0
   16036:	stxdw [r10 - 0x28], r1
   16037:	stdw [r10 - 0x188], 0x1
   16038:	stdw [r10 - 0x198], 0x20
   16039:	stdw [r10 - 0x1a8], 0x20
   16040:	stdw [r10 - 0x1b8], 0x20
   16041:	stdw [r10 - 0x1c8], 0x2
   16042:	stdw [r10 - 0x1d8], 0x4
   16043:	stdw [r10 - 0x20], 0x6
   16044:	mov64 r1, r10
   16045:	add64 r1, -0x28
   16046:	stxdw [r10 - 0xfe8], r1
   16047:	ldxdw r1, [r10 - 0x238]
   16048:	stxdw [r10 - 0xff0], r1
   16049:	mov64 r1, r10
   16050:	add64 r1, -0xd0
   16051:	stxdw [r10 - 0xff8], r1
   16052:	ldxdw r1, [r10 - 0x248]
   16053:	stxdw [r10 - 0x1000], r1
   16054:	stdw [r10 - 0xfe0], 0x1
   16055:	mov64 r1, r10
   16056:	add64 r1, -0x1f0
   16057:	mov64 r2, r10
   16058:	add64 r2, -0x68
   16059:	mov64 r5, r10
   16060:	ldxdw r3, [r10 - 0x260]
   16061:	ldxdw r4, [r10 - 0x258]
   16062:	call 0xa638
   16063:	ldxdw r2, [r10 - 0x1f0]
   16064:	jne r2, 0x2, +0x3e <.text+0x1f6d8>
   16065:	ldxdw r1, [r9 + 0x0]
   16066:	add64 r1, -0x1
   16067:	stxdw [r9 + 0x0], r1
   16068:	ldxdw r3, [r10 - 0x230]
   16069:	jne r1, 0x0, +0x3 <.text+0x1f528>
   16070:	ldxdw r1, [r9 + 0x8]
   16071:	add64 r1, -0x1
   16072:	stxdw [r9 + 0x8], r1
   16073:	ldxdw r2, [r10 - 0x268]
   16074:	ldxdw r1, [r2 + 0x0]
   16075:	add64 r1, -0x1
   16076:	stxdw [r2 + 0x0], r1
   16077:	ldxdw r4, [r10 - 0x238]
   16078:	jne r1, 0x0, +0x3 <.text+0x1f570>
   16079:	ldxdw r1, [r2 + 0x8]
   16080:	add64 r1, -0x1
   16081:	stxdw [r2 + 0x8], r1
   16082:	ldxdw r1, [r3 + 0x0]
   16083:	add64 r1, -0x1
   16084:	stxdw [r3 + 0x0], r1
   16085:	ldxdw r2, [r10 - 0x240]
   16086:	jne r1, 0x0, +0x3 <.text+0x1f5b0>
   16087:	ldxdw r1, [r3 + 0x8]
   16088:	add64 r1, -0x1
   16089:	stxdw [r3 + 0x8], r1
   16090:	ldxdw r1, [r2 + 0x0]
   16091:	add64 r1, -0x1
   16092:	stxdw [r2 + 0x0], r1
   16093:	jne r1, 0x0, +0x3 <.text+0x1f5e8>
   16094:	ldxdw r1, [r2 + 0x8]
   16095:	add64 r1, -0x1
   16096:	stxdw [r2 + 0x8], r1
   16097:	ldxdw r1, [r8 + 0x0]
   16098:	stxdw [r1 + 0xe8], r4
   16099:	stdw [r1 + 0xf0], 0x0
   16100:	ldxdw r2, [r8 + 0x30]
   16101:	add64 r2, 0x20
   16102:	mov64 r1, r10
   16103:	add64 r1, -0x200
   16104:	call -0x3390
   16105:	ldxdw r2, [r10 - 0x200]
   16106:	jeq r2, 0x2, +0x1 <.text+0x1f640>
   16107:	ja +0x34 <.text+0x1f7e0>
   16108:	mov64 r1, r10
   16109:	add64 r1, -0xd0
   16110:	call 0x1ced8
   16111:	ldxdw r1, [r10 - 0xd0]
   16112:	jeq r1, 0x0, +0x31 <.text+0x1f7f0>
   16113:	ldxdw r1, [r10 - 0xc8]
   16114:	ldxdw r2, [r10 - 0xc0]
   16115:	ldxdw r3, [r10 - 0xb8]
   16116:	stxdw [r10 - 0xc0], r3
   16117:	stxdw [r10 - 0xc8], r2
   16118:	stxdw [r10 - 0xd0], r1
   16119:	mov64 r1, r10
   16120:	add64 r1, -0x210
   16121:	mov64 r2, r10
   16122:	add64 r2, -0xd0
   16123:	call 0x1c70c
   16124:	ldxdw r1, [r10 - 0x208]
   16125:	ldxdw r2, [r10 - 0x210]
   16126:	ja -0xbd <.text+0x1f0f0>
   16127:	ldxdw r1, [r10 - 0x1e8]
   16128:	ldxdw r3, [r9 + 0x0]
   16129:	add64 r3, -0x1
   16130:	stxdw [r9 + 0x0], r3
   16131:	ldxdw r5, [r10 - 0x230]
   16132:	jne r3, 0x0, +0x3 <.text+0x1f720>
   16133:	ldxdw r3, [r9 + 0x8]
   16134:	add64 r3, -0x1
   16135:	stxdw [r9 + 0x8], r3
   16136:	ldxdw r4, [r10 - 0x268]
   16137:	ldxdw r3, [r4 + 0x0]
   16138:	add64 r3, -0x1
   16139:	stxdw [r4 + 0x0], r3
   16140:	jne r3, 0x0, +0x3 <.text+0x1f760>
   16141:	ldxdw r3, [r4 + 0x8]
   16142:	add64 r3, -0x1
   16143:	stxdw [r4 + 0x8], r3
   16144:	ldxdw r3, [r5 + 0x0]
   16145:	add64 r3, -0x1
   16146:	stxdw [r5 + 0x0], r3
   16147:	ldxdw r4, [r10 - 0x240]
   16148:	jne r3, 0x0, +0x3 <.text+0x1f7a0>
   16149:	ldxdw r3, [r5 + 0x8]
   16150:	add64 r3, -0x1
   16151:	stxdw [r5 + 0x8], r3
   16152:	ldxdw r3, [r4 + 0x0]
   16153:	add64 r3, -0x1
   16154:	stxdw [r4 + 0x0], r3
   16155:	jne r3, 0x0, -0xda <.text+0x1f0f0>
   16156:	ldxdw r3, [r4 + 0x8]
   16157:	add64 r3, -0x1
   16158:	stxdw [r4 + 0x8], r3
   16159:	ja -0xde <.text+0x1f0f0>
   16160:	ldxdw r1, [r10 - 0x1f8]
   16161:	ja -0xe0 <.text+0x1f0f0>
   16162:	ldxdw r9, [r10 - 0xa8]
   16163:	ldxdw r2, [r8 + 0x0]
   16164:	ldxdw r1, [r2 + 0x40]
   16165:	stxdw [r10 - 0x1c8], r1
   16166:	ldxdw r1, [r2 + 0x38]
   16167:	stxdw [r10 - 0x1d0], r1
   16168:	ldxdw r1, [r2 + 0x30]
   16169:	stxdw [r10 - 0x1d8], r1
   16170:	ldxdw r1, [r2 + 0x28]
   16171:	stxdw [r10 - 0x1e0], r1
   16172:	add64 r2, 0x28
   16173:	mov64 r1, r10
   16174:	add64 r1, -0x1c0
   16175:	call 0x1804
   16176:	ldxdw r1, [r8 + 0x0]
   16177:	ldxdw r2, [r1 + 0x0]
   16178:	ldxdw r2, [r2 + 0x0]
   16179:	ldxdw r3, [r2 + 0x18]
   16180:	stxdw [r10 - 0x188], r3
   16181:	ldxdw r3, [r2 + 0x10]
   16182:	stxdw [r10 - 0x190], r3
   16183:	ldxdw r3, [r2 + 0x8]
   16184:	stxdw [r10 - 0x198], r3
   16185:	ldxdw r2, [r2 + 0x0]
   16186:	stxdw [r10 - 0x1a0], r2
   16187:	ldxdw r2, [r8 + 0x30]
   16188:	ldxdw r2, [r2 + 0x68]
   16189:	ldxdw r3, [r1 + 0xf0]
   16190:	ldxdw r1, [r1 + 0xe8]
   16191:	stxdw [r10 - 0x180], r1
   16192:	stxdw [r10 - 0x178], r3
   16193:	stxdw [r10 - 0x170], r9
   16194:	stxdw [r10 - 0x168], r2
   16195:	mov64 r1, r10
   16196:	add64 r1, -0xd0
   16197:	mov64 r9, r10
   16198:	add64 r9, -0x1e0
   16199:	mov64 r2, r9
   16200:	call 0xdb72
   16201:	ldxdw r1, [r10 - 0xc0]
   16202:	stxdw [r10 - 0x60], r1
   16203:	ldxdw r1, [r10 - 0xc8]
   16204:	stxdw [r10 - 0x68], r1
   16205:	mov64 r1, r10
   16206:	add64 r1, -0x68
   16207:	mov64 r2, 0x1
   16208:	call 0x1cdff
   16209:	add64 r8, 0x60
   16210:	mov64 r1, r10
   16211:	add64 r1, -0x160
   16212:	stxdw [r10 - 0x238], r1
   16213:	mov64 r2, r8
   16214:	call -0x2328
   16215:	ldxb r1, [r7 + 0x22]
   16216:	stxdw [r10 - 0x230], r1
   16217:	mov64 r1, r10
   16218:	add64 r1, -0x130
   16219:	mov64 r2, r9
   16220:	call 0xdb5e
   16221:	lddw r1, 0x11c606
   16223:	lddw r2, 0x11c606
   16225:	add64 r2, 0x8
   16226:	stxdw [r10 - 0xd8], r2
   16227:	stxdw [r10 - 0xe0], r1
   16228:	ldxdw r1, [r10 - 0x130]
   16229:	stxdw [r10 - 0xf0], r1
   16230:	ldxdw r1, [r10 - 0x128]
   16231:	stxdw [r10 - 0xf8], r1
   16232:	stxdw [r10 - 0x100], r1
   16233:	ldxdw r2, [r10 - 0x120]
   16234:	add64 r1, r2
   16235:	stxdw [r10 - 0xe8], r1
   16236:	mov64 r1, r10
   16237:	add64 r1, -0x118
   16238:	mov64 r2, r10
   16239:	add64 r2, -0x100
   16240:	call -0x1fb8
   16241:	ldxdw r8, [r10 - 0x110]
   16242:	ldxdw r9, [r10 - 0x108]
   16243:	mov64 r1, 0x22
   16244:	mov64 r2, 0x1
   16245:	call -0x2949
   16246:	ldxdw r1, [r10 - 0x160]
   16247:	ldxdw r2, [r1 + 0x18]
   16248:	ldxdw r3, [r1 + 0x10]
   16249:	ldxdw r4, [r1 + 0x8]
   16250:	ldxdw r1, [r1 + 0x0]
   16251:	stxdw [r0 + 0x0], r1
   16252:	stxdw [r0 + 0x8], r4
   16253:	stxdw [r0 + 0x10], r3
   16254:	stxdw [r0 + 0x18], r2
   16255:	sth [r0 + 0x20], 0x1
   16256:	stxdw [r10 - 0x60], r0
   16257:	stdw [r10 - 0x68], 0x1
   16258:	stdw [r10 - 0x58], 0x1
   16259:	mov64 r7, r10
   16260:	add64 r7, -0xd0
   16261:	mov64 r5, r10
   16262:	add64 r5, -0x68
   16263:	mov64 r1, r7
   16264:	lddw r2, 0x11e53e
   16266:	mov64 r3, r8
   16267:	mov64 r4, r9
   16268:	call 0x1dbdd
   16269:	mov64 r8, r10
   16270:	add64 r8, -0x68
   16271:	mov64 r1, r8
   16272:	ldxdw r2, [r10 - 0x238]
   16273:	mov64 r3, 0x30
   16274:	call 0x1f380
   16275:	mov64 r1, r10
   16276:	add64 r1, -0x28
   16277:	stxdw [r10 - 0x38], r1
   16278:	mov64 r1, r10
   16279:	add64 r1, -0x1
   16280:	stxdw [r10 - 0x18], r1
   16281:	lddw r1, 0x11c646
   16283:	stxdw [r10 - 0x28], r1
   16284:	ldxdw r1, [r10 - 0x230]
   16285:	stxb [r10 - 0x1], r1
   16286:	stdw [r10 - 0x30], 0x2
   16287:	stdw [r10 - 0x10], 0x1
   16288:	stdw [r10 - 0x20], 0x11
   16289:	mov64 r1, r10
   16290:	add64 r1, -0x38
   16291:	stxdw [r10 - 0x1000], r1
   16292:	stdw [r10 - 0xff8], 0x1
   16293:	mov64 r1, r10
   16294:	add64 r1, -0x80
   16295:	mov64 r5, r10
   16296:	mov64 r2, r7
   16297:	mov64 r3, r8
   16298:	mov64 r4, 0x1
   16299:	call 0x1cdab
   16300:	lddw r1, -0x7fffffffffffffe6
   16302:	ldxdw r2, [r10 - 0x80]
   16303:	jeq r2, r1, +0x1 <.text+0x1fc68>
   16304:	ja +0x11 <.text+0x1fcf0>
   16305:	ldxdw r1, [r10 - 0x58]
   16306:	ldxdw r2, [r10 - 0x60]
   16307:	ldxdw r3, [r2 + 0x0]
   16308:	add64 r3, -0x1
   16309:	stxdw [r2 + 0x0], r3
   16310:	jne r3, 0x0, +0x3 <.text+0x1fcb0>
   16311:	ldxdw r3, [r2 + 0x8]
   16312:	add64 r3, -0x1
   16313:	stxdw [r2 + 0x8], r3
   16314:	ldxdw r2, [r1 + 0x0]
   16315:	add64 r2, -0x1
   16316:	stxdw [r1 + 0x0], r2
   16317:	jne r2, 0x0, +0x3 <.text+0x1fce8>
   16318:	ldxdw r2, [r1 + 0x8]
   16319:	add64 r2, -0x1
   16320:	stxdw [r1 + 0x8], r2
   16321:	ja -0x17f <.text+0x1f0f8>
   16322:	mov64 r1, r10
   16323:	add64 r1, -0x220
   16324:	mov64 r2, r10
   16325:	add64 r2, -0x80
   16326:	call 0x1c641
   16327:	ldxdw r1, [r10 - 0x218]
   16328:	ldxdw r2, [r10 - 0x220]
   16329:	stxdw [r10 - 0x228], r2
   16330:	ldxdw r2, [r10 - 0x58]
   16331:	ldxdw r3, [r10 - 0x60]
   16332:	ldxdw r4, [r3 + 0x0]
   16333:	add64 r4, -0x1
   16334:	stxdw [r3 + 0x0], r4
   16335:	jne r4, 0x0, +0x3 <.text+0x1fd78>
   16336:	ldxdw r4, [r3 + 0x8]
   16337:	add64 r4, -0x1
   16338:	stxdw [r3 + 0x8], r4
   16339:	ldxdw r3, [r2 + 0x0]
   16340:	add64 r3, -0x1
   16341:	stxdw [r2 + 0x0], r3
   16342:	jne r3, 0x0, -0x194 <.text+0x1f0f8>
   16343:	ldxdw r3, [r2 + 0x8]
   16344:	add64 r3, -0x1
   16345:	stxdw [r2 + 0x8], r3
   16346:	ja -0x198 <.text+0x1f0f8>
