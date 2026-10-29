from pathlib import Path
import hashlib,json,re,subprocess
root=Path(__file__).resolve().parent
base=root/'cost-shared-errors'
original=(base/'pump-shared-errors/src/lib.rs').read_text()
a=original.index('#[error_code]\npub enum PumpError {');b=original.index('\n}\n',a)+2
raw=original[a:b]
entries=[];msg=None
for line in raw.splitlines():
 m=re.fullmatch(r'\s*#\[msg\(("(?:\\.|[^"\\])*")\)\]\s*',line)
 if m:msg=m.group(1);continue
 m=re.fullmatch(r'\s*(\w+)(?:\s*=\s*(\d+))?,\s*',line)
 if m:entries.append({'name':m.group(1),'message_literal':msg,'explicit_discriminant':int(m.group(2)) if m.group(2) else None});msg=None
assert len(entries)==111
clean=re.sub(r'^\s*#\[msg\(("(?:\\.|[^"\\])*")\)\]\s*\n','',raw,flags=re.M)
clean=clean.replace('#[error_code]','#[derive(std::fmt::Debug, Clone, Copy)]\n#[repr(u32)]',1)
names='\n'.join(f'            PumpError::{v["name"]} => "{v["name"]}".to_string(),' for v in entries)
display='\n'.join('            PumpError::'+v['name']+' => '+('write!(fmt, '+v['message_literal']+')' if v['message_literal'] is not None else '<Self as std::fmt::Debug>::fmt(self, fmt)')+',' for v in entries)
source='use anchor_lang::prelude::*;\n\n'+clean+'\n\n'+'''impl PumpError {
    pub fn name(&self) -> String {
        match self {
'''+names+'''
        }
    }
}
impl From<PumpError> for u32 {
    INLINE_U32
    fn from(e: PumpError) -> u32 { e as u32 + anchor_lang::error::ERROR_CODE_OFFSET }
}
impl From<PumpError> for anchor_lang::error::Error {
    INLINE_ERROR
    fn from(error_code: PumpError) -> anchor_lang::error::Error {
        anchor_lang::error::Error::from(anchor_lang::error::AnchorError {
            error_name: error_code.name(),
            error_code_number: error_code.into(),
            error_msg: error_code.to_string(),
            error_origin: None,
            compared_values: None,
        })
    }
}
impl std::fmt::Display for PumpError {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::result::Result<(), std::fmt::Error> {
        match self {
'''+display+'''
        }
    }
}
'''
for name,u32,error in [('errors-explicit-control','',''),('errors-inline-u32','#[inline]',''),('errors-inline-conversions','#[inline]','#[inline]')]:
 out=root/name
 if out.exists():raise SystemExit('output exists: '+name)
 subprocess.run(['cp','-cR',str(base),str(out)],check=True)
 (out/'pump-shared-errors/src/lib.rs').write_text(source.replace('INLINE_U32',u32).replace('INLINE_ERROR',error))
inputs=[]
for p in sorted(Path('/Users/shawwalters/.cargo/registry/src').glob('*/anchor-syn-0.31.1/src/codegen/error.rs')):
 d=p.read_bytes();inputs.append({'path':str(p),'sha256':hashlib.sha256(d).hexdigest()})
assert inputs and len({r['sha256'] for r in inputs})==1
(root/'inputs').mkdir(exist_ok=True)
(root/'inputs/anchor-syn-0.31.1-error-codegen.rs').write_bytes(Path(inputs[0]['path']).read_bytes())
(root/'EXPLICIT-ERROR-GENERATION.json').write_text(json.dumps({'generator_version':'anchor-syn0.31.1','generator_files':inputs,'input_enum_sha256':hashlib.sha256(raw.encode()).hexdigest(),'variant_count':len(entries),'entries':entries,'preserved':['all111variant names, declaration order and explicit110discriminant','all message literals and Debug fallback arms','Debug Clone Copy repr(u32)','name/Display match semantics','From<PumpError> for u32 with original ERROR_CODE_OFFSET','From<PumpError> for Anchor Error field construction'],'variants':{'errors-explicit-control':'manual exact macro output, no inline attributes','errors-inline-u32':'only u32 conversion marked inline','errors-inline-conversions':'both conversion methods marked inline'},'limitations':['idl-build feature is disabled in this reconstruction recipe; no generated IDL printing function is included.','No historical crate ownership claim.']},indent=2)+'\n')
