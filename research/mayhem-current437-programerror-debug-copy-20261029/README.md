# 第二处 ProgramError Debug 名称覆盖

本包对原始函数 O0266（起点 618552）及其两个候选函数的 25 条单元变体路径，逐条检查指针、指令中的立即数长度、字节和到 `Formatter::write_str` 的调用，增加 `.rodata` 区间 `[713819, 714313)` 共 **494 字节**。每条路径的名称与已校验的 `solana-program-error` 源码对应；候选地址可以不同。标签是观察到的编译结果，不是稳定的枚举布局保证。`Custom` 路径不计入，检查止于写入辅助函数内的未解析回调之前，不推断运行时输出、分配范围或整个 ELF 相等。

基线为 programerror-debug-names 包：有效数据 **19,239 / 26,180 字节**，其中 `.rodata` **12,783 / 18,396**，`.data.rel.ro` **6,456 / 7,784**。本包后分别为 **19,733 / 26,180**、**13,277 / 18,396**、**6,456 / 7,784**；余 **6,447** 字节未证明。新增区间与基线不重叠，长度来自指令，不包含相邻 NUL。

## 仍未覆盖

目标缺口剩余 `[713022, 713819)` 和 `[714313, 714341)`；其他缺口包括 `[722392, 723755)`、`[709739, 710440)`，以及基线清单和本包 `coverage-delta.json` 补集中的其他区间。`.data.rel.ro` 缺口不变。

## 验证

在仓库根目录执行：

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-programerror-debug-copy-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-programerror-debug-copy-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts python3 -B scripts/test_tooling.py
```

观察记录包含每条路径和两个候选的地址、长度及指令偏移；验证器重新执行上一个包的检查并计算区间并集。变异测试逐字节修改名称及各路径的指针、长度，并检查排除的标签和清单篡改。
