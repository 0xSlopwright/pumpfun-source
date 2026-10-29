# CreatePool argument-storage proposal

Original10240B CreatePool captures the32byte creator key before find_program_address, passes the fixed32byte Pump ID from a relocated readonly address, then compares creator(left) to returned PDA(right). Current H15helper10136B instead materializes four64bit literals on its stack, derives PDA, and only then snapshots creator. Both have66internal calls; cold-block positions differ and no full equivalence is claimed.

The proposed source uses a function-local constant for the fixed ID and writes the comparison in original left-to-right order. No attributes, padding, helper calls or line-number matching were added. This is an original-backed hypothesis before contextual compilation, not a proven gain. Packet verifier checks original exact prefix witnesses, actual PDA/memcmp callees, fixed32byte identity, and the two source changes. No build or VM is run here.
