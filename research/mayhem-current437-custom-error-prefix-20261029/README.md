# Historical Mayhem data attribution: PR #852

This packet independently bounds **22 new bytes** against the common reviewed,
merged #846 data baseline: **21,796 / 26,180 bytes**. Its own bounded historical
union with that baseline is **21,818 / 26,180**. Other open packets are not
included in this per-packet baseline. The separate batch review deduplicates all
eight additions; these figures are not a latest complete source footprint.

The original and qualified437 candidate payload/descriptor/argument/index paths
are checked. This adds finite historical data attribution only: no maintained
code, normalized window or current-native-ELF progress is credited. Text and
relocation-table bytes are proof evidence, not credited payload.

## Retained attribution detail

新增 `.rodata` **22 字节**：`[720306, 720328)`，内容为 `Custom program error: `。原程序的描述符位于 731784，候选程序对应位置为 712224；两者均有重定位指针和明确的 22 字节长度，所指文本逐字节相同。此前已闭合的 ProgramError Display 函数在两侧均引用该描述符。本证据只证明静态数据及引用，不声称运行输出或相邻空间的含义。

在仓库根目录运行：

```sh
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-custom-error-prefix-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-custom-error-prefix-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts /opt/homebrew/bin/python3.12 -B scripts/test_tooling.py
```


The original observations.json.gz is preserved byte-exact; only the derived
coverage baseline/classification report and checker/docs/input seals are updated.

Verification requires the already-merged #846 baseline at its pinned hash.
Use normal Python: public entrypoints refuse `-O` because the retained proof
chain uses assertions. Tests mutate in-memory analysis copies only; these are
never compiler inputs or replacement artifacts.
