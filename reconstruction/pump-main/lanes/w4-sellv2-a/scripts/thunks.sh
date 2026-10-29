#!/bin/bash
SDK=~/.cache/solana/v1.44/platform-tools
f=$1
$SDK/llvm/bin/llvm-readelf -sW $f | awk '$3==24 && $8 ~ /fmt17h(0333b338|c7eb8f54|4559e188|8b296594|5cebf789|ce86dbee|df06088e)/ {print $2, $8}' | while read a s; do
 d=$($SDK/llvm/bin/llvm-objdump -d --no-show-raw-insn --start-address=0x$a --stop-address=$(printf '0x%x' $((0x$a+24))) $f | grep "call" | awk '{print $NF}')
 echo "$a $d ${s:0:70}"
done
$SDK/llvm/bin/llvm-readelf -sW $f | grep "pump_recovered14pump_recovered7sell_v2" | awk '{print "sell_v2",$2,$3}'
