# Independent CreatePool and incentive mint composition review

The frozen joint candidate is9e4891b1a25fc8f7413e1e9f2ed8e5730a1c39301e306ab68fc4e82acfd952c3. The aggregate changes exactly incentives.rs and instructions/create_pool.rs from H15e33e. Both files equal the separately qualified isolated proposals. The public lib.rs entrypoint and native dependency remain byte-identical; the Context-borrow trial is excluded.

Recount:660/785 normalized,159raw,831,376matched text bytes, no gains/losses. The two handler bodies and every ordered internal callee match their isolated proposals after relocation normalization: CreatePool10,048bytes/66calls (original10,240), incentive admin3,128bytes/11calls (original3,168). The CreatePool constant Pump ID bytes, creator snapshot before PDA and creator-left/PDA-right memcmp match original instructions. The incentive mint snapshot is reused by the helper and both serialized events. Its original late bump remains unresolved.

Across803common named functions,798full normalized bodies and relocation patterns are unchanged. Three other functions each differ at one verified typed Source-line store only: incentive claim96->97, initial_liquidity215->214, CreatePool closure148->147. The verifier validates their actual filename pointers. No symbols were added or removed.

This compact packet independently rechecks source composition,57local compiled-input hashes,232recorded input count,765stable dependency-cache records, artifacts, all785window counts and instruction/callee witnesses. Runtime, strict-repeat, dependency archive authentication and full data closure are separate worker/checkpoint gates. No compiler or VM executes here. Whole-body equivalence and whole-ELF identity are not claimed.
