use anchor_lang::{AnchorDeserialize, AnchorSerialize};
use std::io::{Read, Write};
#[derive(Clone)]
pub struct OptionBool(pub bool);
impl AnchorSerialize for OptionBool {
    fn serialize<W: Write>(&self, w: &mut W) -> std::io::Result<()> {
        self.0.serialize(w)
    }
}
impl AnchorDeserialize for OptionBool {
    fn deserialize_reader<R: Read>(r: &mut R) -> std::io::Result<Self> {
        let mut a = [0];
        match r.read_exact(&mut a) {
            Ok(()) => match a[0] {
                0 => Ok(Self(false)),
                1 => Ok(Self(true)),
                _ => Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    format!("Invalid bool representation: {}", a[0]),
                )),
            },
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => Ok(Self(false)),
            Err(e) => Err(e),
        }
    }
}
#[derive(Clone)]
pub struct OptionU64(pub u64);
impl AnchorSerialize for OptionU64 {
    fn serialize<W: Write>(&self, w: &mut W) -> std::io::Result<()> {
        self.0.serialize(w)
    }
}
impl AnchorDeserialize for OptionU64 {
    fn deserialize_reader<R: Read>(r: &mut R) -> std::io::Result<Self> {
        let mut a = [0; 8];
        let mut n = 0;
        while n < 8 {
            let count = r.read(&mut a[n..])?;
            if count == 0 {
                break;
            }
            n += count;
        }
        Ok(Self(u64::from_le_bytes(a)))
    }
}
pub(crate) use crate::instructions::create_pool::*;
