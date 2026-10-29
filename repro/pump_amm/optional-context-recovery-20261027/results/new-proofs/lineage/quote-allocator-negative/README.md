# Allocator-correct quote control

The unmodified u64-denominator object calibrates to the full632 candidate's quote_for_base body (1168bytes), except four actual source-coordinate stores. The BumpAllocator is the same as the compiled application.

The correct original buy-quote target is0x119c8/1192, called by0x376b0+0x238 and0x53350+0x928. The first report's0x11e70 comparison is only a different-body comparison and must not be interpreted as correct buy-quote attribution; that original body has sell/multihop callers. See corrected-target-comparison.json.

The wide-denominator object reproduces the1192-byte instruction schedule against0x119c8 except18 slots: four source-coordinate stores and14 accesses/addresses displaced by24 stack bytes. Adding the real allocator does not remove that displacement. The earlier object-only negative therefore remains valid. No source patch or full-crate trial is selected here.
