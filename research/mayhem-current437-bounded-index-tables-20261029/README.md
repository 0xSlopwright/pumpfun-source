# 索引有界的只读表

在已复核的 #783 覆盖基线上新增 `.rodata` **162 字节**：`[719932, 720036)` 是 26 个四字节零值，`[720248, 720306)` 是 58 字节 Base58 字符表。原程序和对应候选程序均核查重定位指针、表内容、索引上限判断、地址计算和读取指令；越界分支跳过读取，长度分别来自上限 26 与 58 和读取宽度。比较限定于静态表与匹配的代码路径，不推断运行结果或整个程序相等。`[719929, 719932)` 和其余目标范围未计入。

基线为 21,634 / 26,180 字节；新增后为 21,796 / 26,180。`.rodata` 为 14,972 / 18,396，`.data.rel.ro` 仍为 6,824 / 7,784。基线包含 #770、#779 和 #783。未复核的 #819 不计入。索引检查到读取之间的全部中间指令均逐项验证，表内容不含重定位项。

在仓库根目录运行：

```sh
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-bounded-index-tables-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-bounded-index-tables-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts /opt/homebrew/bin/python3.12 -B scripts/test_tooling.py
```
