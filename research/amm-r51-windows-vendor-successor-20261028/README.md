# Staged publication: checked-r51 Windows vendor successor

Status: **prepared for root review; not committed, published or dispatched by this staging step**. This new recipe has executed zero compilers and zero target programs. Prior Windows run 40792092737 failed before the compiler while reconstructing vendor metadata; its original failure log and structured provenance are retained here. The complete local 257-package / 8,437-file acquisition control passed with all original pins unchanged.

The unique installed workflow is `.github/workflows/measure-amm-r51-windows-v144-vendor-successor.yml`. `verify.py` is the unchanged dynamic-root PR714 standard-library verifier. It checks this distinct packet, exact source 69 / lock 257 and the new installed workflow without installing or compiling. `ROOT-REVIEW.json` is a proposed root-review receipt; the root reviewer owns its final verdict and any subsequent commit/publication/dispatch. The frozen private 32-file successor seal is 22d417aba05d2ba9c434745c6247f9f12ae921455f8705b7e82e217ff689c0a0. The older published PR714 manifest is 7e420f505e54332375aa2b7de8393cfdc6f06cae2c19568a6dd639d9536037ba; that packet and its installed workflow remain unchanged.

The inherited private README follows. Its dormant/publication language describes the frozen private proposal; this opening status and the new publication receipts describe the staged copy.

---

# Checked-r51 Windows vendor acquisition successor — private review copy

This is an unpublished, undispatched successor to the frozen default-host proposal and the published PR714 packet. Actual Windows run **40792092737 failed before invoking a compiler**: the unchanged Mayhem vendor helper could not reconstruct the existing AES checksum JSON pin. The native inventory passed and both SDKs were downloaded/extracted before that failure. `previous-hosted-failure.json` and its gzip log preserve that failed result; it is not a Windows compiler or ELF measurement.

## The correction and its measured scope

The original AMM vendor acquisition script (`research/amm-fresh-v144-20261028/controllers/acquire_vendor.py`) serialized checksum metadata with `json.dumps(..., sort_keys=True) + "\n"`. The byte-pinned Mayhem helper tried ordinary JSON formats with archive-order file keys only. That happened to suffice for 221 packages, but 36 packages have a different archive order and require lexical file-key order.

`vendor.py` adds exactly that second file-key order to the same standard JSON formatting choices. It accepts only one unique encoded byte string matching the **existing expected checksum-file SHA-256**. Every source archive is authenticated against its existing Cargo.lock checksum, extracted source bytes are unchanged, and the unchanged builder's full vendor membership/hash gate still runs after acquisition and before/after compilation. No vendor hash, source map, SDK map, native pin, or compiler input is replaced. The local helper also rejects nonregular, duplicate and unsafe archive paths and refuses existing output package directories.

`prepare.py` continues importing the unchanged Mayhem helper SHA-256 `21d9b0cc31440f72d02a034c8d60eb2dbf19500e76d36056d716eda5fe1c342e` for native inventory, authenticated download and SDK extraction. Only vendor metadata construction calls the new AMM-local helper, whose bytes are additionally pinned in `proposal-pins.json`. It always retains `acquisition.json` after output-directory creation, including status, phase, completed package receipts, failed package identity/error/traceback and whether a compiler ran. The retainer uploads this receipt even when preparation fails. `vendor-retention-control.json` records an actual run of the new retainer preserving the real failure JSON and the real Linux 131-member linker archive/map/inventory with unchanged bytes.

## Complete local acquisition control

The actual `check_vendor.py` run used admitted cached archives, performed no downloads and executed no compiler. It authenticated all 257 locked archives against the exact current 69-file source packet, reproduced the old helper's exact AES error, then reconstructed **all 8,437 vendor files, including all 257 `.cargo-checksum.json` files**, with exact membership and every original SHA-256. All257 metadata files match the ordinary original lexical JSON serialization;221 also match archive order and 36 require the new order. A deliberately wrong metadata SHA was rejected before writing any extracted files. The complete per-package receipt is `vendor-control.json.gz`; extracted files remain private outside this packet at `../windows-vendor-control/vendor`.

Reproduce from the repository root (the second cache is optional when the first contains all 257 archives):

```
python3 -I -B PATH_TO_THIS_PACKET/check_vendor.py --repo . --cache research/amm-sell-fresh-20261028/work/linux/cargo-home/registry/cache --cache /Users/shawwalters/.cargo/registry/cache --output NEW_PRIVATE_OUTPUT
```

`failure-control.json` additionally records an actual invocation of this new preparer on Darwin: the unchanged native helper rejects the non-Windows host, and the preparer writes the expected structured failure receipt. This is a failure-retention check, not Windows execution.

## Unchanged build and input boundary

`build.py`, source archive/binding, host-tools, SDK/sysroot maps, vendor acquisition records and vendor-file map are byte-identical to the accepted default successor. The source archive remains `aaaf7ac67b672ca8759a898e6e56af455f72fadf2cf4dd752ecbbe232a7044f0`; the source 69 and lock 257 inputs are unchanged. The reviewed native digest remains `24e416c49991394bda6374439d05d8f004144a6e5c93492fc5541a78c472a36e`. The imported SDK/native helper pin remains 21d9b0cc… .

The first build still uses ordinary Windows v1.44 default linking with admitted Linux v1.44 SBPF libraries and a new Cargo target/home. The official linker emits its ordinary map and reproduction archive; `linker-reproduction-inventory.json` retains every archive member's name, size and type beside archive/map hashes. These are evidence for an eventual ordinary ordered Windows cohort, not edited build inputs. Linux member/CGU identities cannot be assumed to match Windows identities. The existing Linux side-output neutrality, native pin audit and retention evidence remain included unchanged. No SBPF target is run. Actual ELF/window/meaningful-byte comparison and a repeat of any gain remain future work after Windows compilation.

## Review and publication boundary

The frozen original19-file proposal, frozen25-file default successor, PR714 packet, their manifests/ROOT-REVIEW and installed old workflow remain unchanged. `parent-proposal.json` binds their existing seals.

Prospective new packet: `research/amm-r51-windows-vendor-successor-20261028`.
Prospective unique workflow: `.github/workflows/measure-amm-r51-windows-v144-vendor-successor.yml`.

`workflow.proposal.yml` is dormant here. It uses the same measured native pin and pinned actions/Python/runner, retains the old installer-verifier's exact external workflow in sparse checkout, and selects only this prospective new packet. The root reviewer must add a fresh publication status, manifest/ROOT-REVIEW and published verifier binding this unique installed workflow; the old publication gate binds the old workflow and cannot be edited or reused as the new review. No hosted job was dispatched from this private successor. YAML/actionlint and Python parsing are recorded separately and do not claim Windows execution.
