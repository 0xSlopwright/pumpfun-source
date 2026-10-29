# Exact Mayhem MSVC acquisition fallback

The actual Microsoft VSIX members for **VS Build Tools 17.14.40**, tool package
**14.44.35228**, match both pre-existing qualified executable hashes:

| Member under `Contents/VC/Tools/MSVC/14.44.35207/bin/Hostx64/x64/` | Bytes | SHA-256 |
| --- | ---: | --- |
| `cl.exe` | 677,736 | `88c8344236a27a6e727e0a8edc49aaa2690bdc7a9464b9d18cc7abe70a9f1c0d` |
| `link.exe` | 3,252,576 | `ca11e6c45debd34bf652dfe984c5360a531a005ed78bf72852330c9c2590cf0d` |

The archive SHA-256 is
`ee0baaa3a112d255f19f6c27dcc0ff6e496949eb9f1f37be0ac908c562a7076c`.
Its [official VSIX download](https://download.visualstudio.microsoft.com/download/pr/bbc72d8e-2acd-4229-8f6a-85e23c5e3456/ee0baaa3a112d255f19f6c27dcc0ff6e496949eb9f1f37be0ac908c562a7076c/Microsoft.VC.14.44.17.14.Tools.HostX64.TargetX64.base.vsix)
was downloaded, its whole-file digest verified, and both member byte digests
compared with the independent earlier research packet. No compiler was executed.
The currently latest 17.14.43 package contains different executables. The directory
label `14.44.35207` alone therefore does not identify the qualified binaries.

The [official fixed-version bootstrapper](https://download.visualstudio.microsoft.com/download/pr/f8d58e41-102a-4347-a567-60d7235da3b5/aac092d0d839fd078e86b301d886130f1605891061242b36facf55ccbdd5a0a7/vs_BuildTools.exe)
was also downloaded with verified SHA-256
`aac092d0d839fd078e86b301d886130f1605891061242b36facf55ccbdd5a0a7`.
Its embedded configuration selects fixed channel
`https://aka.ms/vs/17/release/626735536_703519794/channel`.
Microsoft documents fixed-version bootstrappers in its
[release history](https://learn.microsoft.com/en-us/visualstudio/releases/2022/release-history)
and supports selecting components through its
[installer command line](https://learn.microsoft.com/en-us/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=vs-2022).

If the hosted preflight lacks the tools, a reviewed next workflow revision can
install this fixed Build Tools cohort into a distinct directory under
`C:\Program Files (x86)\Microsoft Visual Studio\2022\MayhemPinned`, selecting
`Microsoft.VisualStudio.Component.VC.Tools.x86.x64` and
`Microsoft.VisualStudio.Component.Windows11SDK.26100`. This is a proposed install
route, not an installation receipt. The current Windows image already advertises
Kit directory 10.0.26100.0; actual file identity still requires the native preflight.
The fixed tools' dependent DLLs, headers and libraries must be installed with the
same cohort. Merely copying two executable files is insufficient.

After installation, the existing preflight must find the exact cl/link hashes,
record the entire selected MSVC and Windows Kit byte trees, and require their
reviewed manifest hash before any source compilation. A successful ELF build
must then pass the unchanged exact output checks. The acquisition probe does not
weaken any of these requirements or change the frozen 76 publication files.

`mayhem-msvc-acquisition.json` records all observed locators and hashes. The
downloaded catalog JSON's whole-file digest **did not** match the channel's
declared digest, consistently across sampled releases. Its actual digest is
recorded separately; the catalog is used only as an HTTPS locator, and no fully
authenticated historical catalog chain is claimed. The matching compiler
identity comes from actual VSIX member bytes equaling the independently recorded
cl/link hashes.
