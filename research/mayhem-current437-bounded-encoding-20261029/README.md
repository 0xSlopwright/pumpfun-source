# Mayhem 有界编码名称和错误字符串

主目标 `[719929, 720376)` 新证明 **183 字节**，范围为 `[720036, 720219)`。十处指令在原始和候选映像中分别装入地址与立即数长度，指向的字节逐一相同；此证明只覆盖这些静态指令和指定字节，不声称程序运行输出、整个函数或整份二进制相等，不用 NUL 或邻接关系确定长度。指令地址与文本见 `observations.json.gz`，每条长度均独立验证。

覆盖基线为已合并的 #750、#756、#758、#770、#779 的覆盖并集。本包仍独立复核 #770 的三处历史证据，并校验两个新增前置包的公开清单。基线为 21,451 / 26,180 字节；本包后为 **21,634 / 26,180**，其中 `.rodata` 14,810 / 18,396，`.data.rel.ro` 6,824 / 7,784。新增的 183 字节与全部前置覆盖不重叠。主缺口其余字节未证明，包含零填充与未经长度约束的数据。

在仓库根目录运行：

```sh
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-bounded-encoding-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B research/mayhem-current437-bounded-encoding-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 /opt/homebrew/bin/python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts /opt/homebrew/bin/python3.12 -B scripts/test_tooling.py
```

provider=OpenAI model=gpt-6.1-terra client=codex-cli reasoning=high

Made via @slopdotcash
