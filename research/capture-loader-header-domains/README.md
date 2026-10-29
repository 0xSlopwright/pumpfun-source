# Loader-header and observation domains

The archived saved-evidence gate interprets every nonzero upgrade-authority
option byte as Some, accepting tags 2 and 255 after the copied account hash is
updated. It also accepts incomplete or fractional/overflowing observation slots;
the legacy branch does not check observation slots at all.

This successor validates the loader's 0/1 option domain and the capture workflow's
four upgradeable or two legacy uint64 observation slots, including ordering. It
then runs the reviewed optimization-safe byte gate from #961, retaining all old
checks under Python `-O` and `-OO`. It complements the separate declared-identity
gate from #980; it does not replace or weaken that gate.

```
python research/capture-loader-header-domains/test_verify.py
python research/capture-loader-header-domains/verify.py
```

Tests use private repository-shaped copies, detach hardlinks before mutation,
prove the old gate accepts each malformed case and the new gate rejects it, and
verify all nine original captures in three interpreter modes. Original captures
and root helpers remain intact. This checks saved-evidence format consistency,
not RPC truth, consensus, replay execution or source equivalence.
