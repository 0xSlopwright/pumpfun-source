# Final global-config resize replay

The portable producer runs the existing98-case resize suite for
set_boost_authority and update_creator_fee_config. It checks errors, complete
config bytes, lamport deltas and event bytes; complete raw logs are also retained
and matched to the signed observer hashes. Cases cover historical account
lengths, rent funding, malformed payloads, authority values, and account roles.

The selected and explicit5c1e baseline branches each contain98 case pairs and
196 signed messages. `verify.py` checks the exact inventory/hashes, producer
inputs, every signature, equal paired transaction messages, raw log hashes,
and the candidate/baseline ELF identities. It does not rerun transactions or
claim whole-program equality. `baseline/candidate.so` is the explicit old ELF.
