# Reserved recipient ownership and validation

Original handler starts at0x19138 and spans9176bytes. After the8-recipient lower-bound guard, it reads the bump heap pointer at0x300000000, reserves256bytes, writes eight32byte keys obtained through the48byte AccountInfo stride, then copies the224byte tail from heap+32 to stack before Rent::get. The first key is kept separately. The first direct call is memcpy at+0x3b0 with count224; Rent::get follows at+0x3c8. This is an allocated key collection and early tail extraction, not the selected stack-only[Pubkey;8] initialization.

Each nonzero validation then copies the current AccountInfo.key and compares those32bytes with a zero key. For example, the second key uses AccountInfo stride48 and copies through the key pointer before memcmp at+0x858. The original therefore validates the actual remaining AccountInfo key separately from its earlier key collection. Selected656 reads recipients[i] from its local key array. Its source also indexes remaining_accounts[i] in a second loop.

The first trial restores Vec collection and early first/tail extraction only. It places memcpy224 and Rent::get40bytes earlier than the original, compared with the selected source's missing heap phase. It remains unselected: the complete body grows to10760bytes,75direct calls, and retains the original656/148 census. The frozen first-trial manifest binds the source/build/signed178case receipts.

The next refinement changes only the validation loop to iterate the first8AccountInfos and validate recipient.key() directly. Count guard, first8 selection, duplicate behavior, error order, and final state writes are preserved. No seven-Pubkey serialization type or inline attributes change.

For update_buyback_config, all6direct call positions and the1344byte body extent agree. Its two setter callees differ only in source-origin line stores (one and two respectively). The caller differs mainly in stack-slot positions plus its error source line/length. No coordinate padding or unsupported setter semantic change is proposed.
