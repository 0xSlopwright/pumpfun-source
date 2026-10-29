# Historical Mayhem data attribution: PR #819

This packet independently bounds **29 new bytes** against the common reviewed,
merged #846 data baseline: **21,796 / 26,180 bytes**. Its own bounded historical
union with that baseline is **21,825 / 26,180**. Other open packets are not
included in this per-packet baseline. The separate batch review deduplicates all
eight additions; these figures are not a latest complete source footprint.

The original and qualified437 candidate payload/descriptor/argument/index paths
are checked. This adds finite historical data attribution only: no maintained
code, normalized window or current-native-ELF progress is credited. Text and
relocation-table bytes are proof evidence, not credited payload.

## Retained attribution detail

# Utf8Error 调试字段

本包新增 `.rodata` **29 字节**：`[720219,720228)`（`Utf8Error`）、`[720228,720239)`（`valid_up_to`）和 `[720239,720248)`（`error_len`）。原始函数 646872 与候选函数 580552 中，分别检查重定位指针、长度及参数传递，再检查两者调用对应的 `debug_struct_field2_finish`（调试结构体格式化辅助函数）。长度来自立即数及栈上字段；检查止于调用，不推断运行时输出或相邻字节。候选数据地址分别为 700659、700668、700679。

在仓库根目录运行：

```sh
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-utf8-debug-fields-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-utf8-debug-fields-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts /opt/homebrew/bin/python3.12 -B scripts/test_tooling.py
```


The original observations.json.gz is preserved byte-exact; only the derived
coverage baseline/classification report and checker/docs/input seals are updated.

Verification requires the already-merged #846 baseline at its pinned hash.
Use normal Python: public entrypoints refuse `-O` because the retained proof
chain uses assertions. Tests mutate in-memory analysis copies only; these are
never compiler inputs or replacement artifacts.
