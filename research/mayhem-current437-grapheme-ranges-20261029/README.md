# Historical Mayhem data attribution: PR #881

This packet independently bounds **751 new bytes** against the common reviewed,
merged #846 data baseline: **21,796 / 26,180 bytes**. Its own bounded historical
union with that baseline is **22,547 / 26,180**. Other open packets are not
included in this per-packet baseline. The separate batch review deduplicates all
eight additions; these figures are not a latest complete source footprint.

The original and qualified437 candidate payload/descriptor/argument/index paths
are checked. This adds finite historical data attribution only: no maintained
code, normalized window or current-native-ELF progress is credited. Text and
relocation-table bytes are proof evidence, not credited payload.

## Retained attribution detail

# Qualified437 grapheme lookup byte ranges

本证据包新增 **751 字节**：原始 `.rodata`（只读数据段）`[722528, 723279)`，对应候选二进制 `[702968, 703719)`；两边逐字节相同。区间右端不包含在内。上一证据包是 `mayhem-current437-rust-panic-messages-20261029`，没有重复计入其相邻区间。

原始函数 `[696640, 697736)` 与候选函数 `[630320, 631416)` 的完整指令分别固定校验。函数从 34 项四字节索引表读取起点，取每项高 11 位作为字节偏移；起点严格递增，从 0 到 747。对于最后一项，指令 `697416` 使用立即数 751 作为结束偏移；其他项使用下一索引的起点。函数用 `697528` 载入表地址，再于 `697600` 按字节读取，并以 `697656` 控制循环。验证两份二进制中指令、重定位（地址修正记录）、全部索引和值、表内每个字节和段边界。34 个相邻非空片段的合并范围恰为 `[0, 751)`；长度来自指令与索引，不依赖邻接字符串或猜测二进制内容。

验证：

```sh
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-grapheme-ranges-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-grapheme-ranges-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B scripts/test_tooling.py
```

测试逐字节修改两份表、逐项修改索引，并修改地址、末尾索引、分支和读取指令；也检查区间后一字节不被吸收、文件清单、特殊文件及重新封存的伪造报告。


The original observations.json.gz is preserved byte-exact; only the derived
coverage baseline/classification report and checker/docs/input seals are updated.

Verification requires the already-merged #846 baseline at its pinned hash.
Use normal Python: public entrypoints refuse `-O` because the retained proof
chain uses assertions. Tests mutate in-memory analysis copies only; these are
never compiler inputs or replacement artifacts.
