#![no_std]
extern "C" { fn first(x:u64)->u64; fn second(x:u64)->u64; }
#[no_mangle]
pub unsafe extern "C" fn branch(x:u64)->u64 { if x == 0 { first(x) } else { second(x) } }
