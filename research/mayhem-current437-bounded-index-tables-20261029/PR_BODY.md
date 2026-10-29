## 内容

基于主线 #770 的覆盖链，核对原程序与候选程序的索引边界、指针和读取指令，新增 `.rodata` 162 字节：`[719932, 720036)` 和 `[720248, 720306)`。其余缺口不计入；不依赖 #783、#819 或 #779。

## 验证

运行证据包的 verify.py、test_verify.py，以及 scripts/verify_evidence.py、scripts/test_tooling.py。证据仅支持静态表与匹配路径，不代表运行时或整个程序相等。

Review binds every instruction between the second index guard and load, preserving the bounded index register, and excludes relocations in the credited table ranges. Three tests cover the revised decoder and baseline union. No new function window or runtime claim.
