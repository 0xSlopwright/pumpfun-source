#!/bin/bash
# rec.sh MECH STATUS "hypothesis" "notes" [ratio] [bytes]
L=/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/w4-sellv2-a/reconstruction/pump-main/log_attempt.py
K=0x144508-main-630a074-$1-v1
python3 $L check --dedupe-key $K >/dev/null 2>&1 || true
python3 $L record --lane w4-sellv2-a --approach ir-oracle-first --target 0x144508 --dedupe-key $K --hypothesis "$3" --status $2 --data "{\"output\":\"~/.cache/pumpfun-reconstruction/lanes/w4-sellv2-a\",\"target\":{\"ratio\":${5:-0},\"cand_bytes\":${6:-0}},\"notes\":\"$4\"}" 2>&1 | tail -1
