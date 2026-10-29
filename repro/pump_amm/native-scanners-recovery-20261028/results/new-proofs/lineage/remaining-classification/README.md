# H15 independent remaining-window census

Candidate `e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615`, compared with frozen H14 `98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3` and the original capture. Run `python -B verify.py` with Python3.

Independent strict census: **660/785 normalized (84.0764%),159 raw,125 remaining (15.9236%)**. Matched text831376/1162040 bytes (71.5445%); remaining330664 (28.4555%). Full ELF equality is false.

The single new normalized match is supported_mint0x73ef0/568. It calls matching64B comparison and152B borrow panic helpers, but its392-byte-offset scanner call points to a1168B body while original has1192B; wrapper matching does not close that target.

Remaining classification:80 have a same-sized same-relocation candidate differing only in recognized typed Source filename-length/line immediates;7 contain other instructions;38 lack a same-size/relocation candidate. These80 are diagnostic candidates, not authenticated semantic owner assignments. The45 code/shape gaps remain independent of formatting/line padding. Source-owner filenames and upstream hints are routing evidence only. No compiler or VM was run by this census; full source/dependency and current signed-receipt checks are in the companion independent packet.
