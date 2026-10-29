#![no_std]
#[derive(Clone, Copy)]
pub struct Fees {
    pub lp_fee_bps: u64,
    pub protocol_fee_bps: u64,
    pub creator_fee_bps: u64,
    pub lp_fee: u64,
    pub protocol_fee: u64,
    pub creator_fee: u64,
}
#[derive(Clone, Copy)]
pub struct Gates { pub protocol: bool, pub creator: bool, pub lp: bool }
pub fn apply_masks(fees: &Fees, gates: &Gates) -> Fees {
    let creator_mask = 0u64.wrapping_sub(u64::from(gates.creator));
    let lp_mask = 0u64.wrapping_sub(u64::from(gates.lp));
    let protocol_mask = 0u64.wrapping_sub(u64::from(gates.protocol));
    Fees {
        lp_fee_bps: fees.lp_fee_bps & lp_mask,
        protocol_fee_bps: fees.protocol_fee_bps & protocol_mask,
        creator_fee_bps: fees.creator_fee_bps & creator_mask,
        lp_fee: fees.lp_fee & lp_mask,
        protocol_fee: fees.protocol_fee & protocol_mask,
        creator_fee: fees.creator_fee & creator_mask,
    }
}
pub fn paired_conditions(fees: &Fees, gates: &Gates) -> Fees {
    let (creator_fee_bps, creator_fee) = if gates.creator {
        (fees.creator_fee_bps, fees.creator_fee)
    } else { (0, 0) };
    let (lp_fee_bps, lp_fee) = if gates.lp {
        (fees.lp_fee_bps, fees.lp_fee)
    } else { (0, 0) };
    let (protocol_fee_bps, protocol_fee) = if gates.protocol {
        (fees.protocol_fee_bps, fees.protocol_fee)
    } else { (0, 0) };
    Fees { lp_fee_bps, protocol_fee_bps, creator_fee_bps, lp_fee, protocol_fee, creator_fee }
}
