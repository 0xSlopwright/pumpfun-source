# Disable flag-write source control

Original handler `0x17960` writes `GlobalConfig.disable_flags` five times, at offsets 64/136/216/288/360, with a fresh GlobalConfig access for each bit. The frozen H9 handler writes it once after combining the five inputs. This is an actual instruction/data-access difference, not a diagnostic-coordinate difference.

The proposed uncompiled patch removes the shared `&mut disable_flags` binding and uses five direct field assignments. Masks, Boolean inputs, assignment order, event fields and all other code are unchanged. This makes the intended per-field access structure explicit while preserving the final byte for every initial flag byte and every Boolean combination.

Small standalone field-only functions produced no retained object bodies and are negative controls. The full-handler objects do retain bodies: baseline 2,952 bytes and direct-field form 3,104 bytes. Neither is a complete calibration of the linked baseline (3,016 bytes) or original (3,024 bytes). The direct-field object has five writes at 64/136/216/296/368; the baseline object has one at 240. These prove the access-pattern distinction, not exact function recovery or predicted linked sizes.

No full build or runtime replay was performed for this patch. It remains a candidate for a future combined build. No forced attributes, fake coordinates, assembly changes or padding were used. Both earlier InitBoost/H9 packets remain unchanged.

`verify.py --root ROOT --candidate CANDIDATE --symbols SYMBOLS` accepts the frozen H9 candidate explicitly; it verifies original/current access counts, object controls and the exact source-only patch. Defaults point to H9's public checkpoint paths. The source/object packet is self-contained except the pinned original and H9 ELF files.
