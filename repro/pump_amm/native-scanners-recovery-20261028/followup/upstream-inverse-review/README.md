# Upstream inverse-fee follow-up review

Reviewed PR411 at `da0fea0290ee45c312b3bb00af273f420a511264`. The retained patch adds the same checked inverse-fee method and by-value caller already recovered in the maintained H14 checkpoint. It explicitly adds `#[inline(never)]` and leaves a blank line where the packed SPL conversion was removed. The maintained reconstruction recovers the 776-byte native method without that attribute; its caller retains an explicitly reported source-coordinate difference.

No additional source component is selected from this patch. This review binds the exact patch and its upstream Git blob identity; it does not re-certify the PR's complete artifact or runtime corpus. The upstream baseline differs from the maintained one. In particular, the separate signed upstream incentive replay already demonstrates 128 regressions in the higher-count research branch, which prevents wholesale adoption.
