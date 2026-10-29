#!/bin/sh
B=/Users/shawwalters/Documents/Codex/2026-10-24/amm-sell-swarm/infra/sdk-native/rust/lib/rustlib/aarch64-apple-darwin/bin
S=$($B/llvm-objdump -h "$1" | awk '/\.text\..*8swap_hop17h/ && !/rel/ {print $2}')
$B/llvm-objdump -dr --no-show-raw-insn -j $S "$1" | python3 -c "
import sys,re
last=None
for l in sys.stdin:
    m=re.match(r'^ +([0-9]+):\s*(.*)',l)
    if m: print('%5x  %s'%(int(m.group(1))*8,m.group(2).rstrip())); continue
    m=re.match(r'^\s+[0-9a-f]+:\s+R_\w+\s+(\S+)',l)
    if m: print('          ; '+re.sub(r'17h[0-9a-f]{16}E$','',m.group(1))[-50:])"
