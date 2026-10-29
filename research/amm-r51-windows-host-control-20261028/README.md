# Exact checked-r51 Windows default build

This publishes the reviewed default-only recipe for the **first exact checked-r51 Windows measurement**. At recipe review, no hosted job or Windows compiler had executed this source. Execution results are recorded separately; preparing or dispatching this job awards no recovered windows. The original 19 bound parent files and manifest remain unchanged (`5a233805eb716d5a015e8d0f5592b57c93e4cde2a2bd4a09dd508aa3627e3dfd`).

## The existing reviewed native pin applies directly

Use `native_inputs_sha256=24e416c49991394bda6374439d05d8f004144a6e5c93492fc5541a78c472a36e` for the first job. There is no need for another empty preflight solely because the contract changes.

The actual successful Mayhem run 40770208958 ZIP at `research/mayhem-canonical-promotion-20261028/hosted/40770208958/build.zip` has byte-identical `inputs/native-inputs.json` and `native-postcheck/native-inputs.json`, each SHA-256 `43f980b6a65bb7f4c601b0adfb8fe7ec533e5cedf0b29b127e64cb0f8d829b52`. Recomputing their canonical native dictionaries yields that reviewed 24e416… digest. Both include exactly 1,555 MSVC files and 6,936 Windows Kit files (698 bin, 4,781 Include,1,457 Lib files for version 10.0.26100.0).

The AMM preparer imports the **same byte-pinned** `prepare_mayhem_windows_inputs.py` (`21d9b0cc…`) used by that actual hosted Mayhem route. Its `native_inputs()` and `inventory()` functions are unchanged. The offline Mayhem transport adapter calls `parent.native_inputs()` directly and only later adapts registry downloads. AMM changes `RECIPE` solely to an identical normalized cl/link hash map. Selected native roots and canonical `json.dumps(...,sort_keys=True,separators=(",",":"))` serialization are identical; the dictionary contains no contract source or output path. `native-pin-audit.json` records the recomputation.

The new runner must reproduce that complete digest; the existing helper rejects drift. The prospective workflow now defaults to the reviewed pin, while an explicitly empty input still supports deliberate native-only preflight.

## Why the ordered cohort is deferred

The frozen parent ordered script embeds Linux Cargo archive/member locators, internal CGU identities and mangled section names. Already retained old AMM controls demonstrate that Windows uses root metadata `fa32e4e94da081a2` and sell symbol suffix `267062fc612b4789`, versus Linux metadata `bb5f628ba4a31e11` and suffix `ccb72da5245169af`. Their normalized sell instructions agree, but symbol/input identities do not.

Therefore the original Linux-specific script is not a qualified Windows ordering recipe. It can miss sections and append orphans; blindly running it would confound the host control. No section-name wildcarding, metadata substitution, object change, or ordering assumption is introduced here. A later ordinary Windows ordering recipe needs the actual emitted input/section identities and a measured one-to-one mapping after this first source build.

The frozen native driver itself is byte-identical to the driver actually compiled and executed in successful hosted Mayhem run 40770208958 (`c6355bff323ef9fc63743d7a053a97f4ecfd64b42fbd3aa825969c2a38b0a44e`). The actual 121-line response file uses the expected quoted UTF-8/LF form. That exact source also passes the local v1.44 Rust frontend metadata compilation. These checks identify no driver syntax/response-format blocker, but do not claim Windows v1.44 driver execution. The first default control does not use a custom driver at all.

## Exact source and admitted compiler inputs stay fixed

The same 69 checked-r51 workspace files are compiled, including sell SHA-256 `4d520b5f18c121d91784e662fbc6f5816dad39ce06c237ceecc90fafd6b84549`. Source archive SHA-256 is unchanged: `aaaf7ac67b672ca8759a898e6e56af455f72fadf2cf4dd752ecbbe232a7044f0`.

The SDK component, admitted Linux SBPF library, host-tool, locked registry and vendor maps are unchanged from the executed AMM Windows v1.44 packet. The host uses the official Windows v1.44 tools, the exact isolated MSVC cohort, and the separate admitted Linux v1.44 target sysroot. Source and dependency bytes are checked before/after compilation. Each Cargo target and Cargo home is new. Cargo is offline. No deployed/original executable is passed into a build command.

## Retain the evidence required for the later ordering recipe

`build.py` compiles only ordinary Windows default layout. It selects the official Windows rust-lld explicitly and adds these two **root-only ordinary LLD side-output flags** through `cargo rustc`:

```
-C link-arg=--Map=ABSOLUTE_OUTPUT/link.map
-C link-arg=--reproduce=ABSOLUTE_OUTPUT/link.tar
```

No custom linker script or link driver is used. The real LLD map binds actual input/archive/member/section identities. The real reproduction archive preserves the actual root object bytes, archive members, scripts and effective response inputs. They are diagnostic outputs and are never patched or fed back as candidate build inputs. The builder creates `linker-reproduction-inventory.json` from every actual archive member, including its name, size and type, and binds it to the archive SHA-256. The retainer uploads that JSON beside the archive and map. An integration control using the actual Linux archive confirms all 131 member records, unchanged archive bytes and all three paths in the uploaded manifest (`retention-control.json`). The symbol ELF, stripped ELF, source binding, native before/after maps and compiler logs are retained too, without ordinary SDK/Cargo caches.

A genuine local Linux v1.44 check with these exact side-output flags compiled the same 69 source inputs and reproduced the known whole stripped default r51 ELF **exactly**, SHA-256 `b6f62738ea983e3acde0dfe1d24027af1355199807745d733c75c88a044e4d73` (784 normalized/394 raw). Its actual reproduction archive contains 131 members / 100,424,704 bytes. `linux-neutral-link-control.json` records hashes and membership. This establishes neutrality and retention on the admitted v1.44 linker; it is not a Windows build, repeat qualification or new recovered window.

## Review and staging

`workflow.proposal.yml` preserves the dormant review copy. The installed workflow is `.github/workflows/measure-amm-r51-windows-v144.yml`. `ROOT-REVIEW.json` binds the frozen private successor and the installed workflow. It defaults to the already reviewed native pin and compiles **one default-layout cohort**, then rechecks the full native trees. Root retains responsibility for the unchanged 785-window inventory, physical-window boundaries, actual direct callees, full source/runtime gates and literal whole meaningful ELF comparison after real outputs return. Any winning recipe still needs an independent fresh repeat.

The noncone sparse checkout also includes exactly `/.github/workflows/rebuild-canonical-mayhem-pinned-msvc.yml`. The existing installer verifier binds that file outside its own packet. An isolated checkout containing only its six declared files and manifest passes the verifier; it has no other external repository reads (`installer-sparse-closure.json`). The old workflow and installer manifest are unchanged.

Both parent and successor workflows pass actionlint 1.7.12. Python parsing, source archive, all 257 locked packages, input maps and manifests pass their checks, with unchanged parent seal. No PowerShell or Windows execution is implied by linting. Known native path spelling and compiler metadata differences remain observable in the actual output; no path remapping, instruction padding, normalized mask expansion or graph diagnostic earns acceptance.

Run `python3 -I -B research/amm-r51-windows-host-control-20261028/verify.py` to check the published packet, exact69 source archive, locked dependency pins and installed workflow without installing or compiling anything.
