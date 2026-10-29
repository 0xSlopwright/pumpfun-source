# 有界错误字符串覆盖

本包在 #758 的基线上新增 `.rodata` **38 字节**：`[713383, 713388)` 和 `[713808, 713813)` 均为 `Error`，`[714313, 714341)` 为 `failed to write whole buffer`。每处都检查原始程序与所有对应候选中的重定位指针、指令立即数长度、内容及直接调用；前两处还检查写入辅助函数，第三处检查调用到 `std::io::Error::new` 及其保存参数的开头。证据止于这些静态调用，不推断实际运行输出或整个程序相等。长度来自指令，不依赖 NUL 字节。

基线合并 #758、MayhemError 名称包和 #756 的覆盖并集，有效数据为 20,709 / 26,180 字节；本包后为 20,747 / 26,180，剩余 5,433 字节。`.rodata` 为 14,035 / 18,396，`.data.rel.ro` 仍为 6,712 / 7,784。长度表 `[713112, 713272)` 不计入；四条交易指令日志所属函数尚未闭合，也不计入。已发布清单不修改。

在仓库根目录用 Python 3.11 或更新版本运行：

```sh
PYTHONDONTWRITEBYTECODE=1 python3.12 -B research/mayhem-current437-bounded-error-strings-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3.12 -B research/mayhem-current437-bounded-error-strings-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts python3.12 -B scripts/test_tooling.py
```
