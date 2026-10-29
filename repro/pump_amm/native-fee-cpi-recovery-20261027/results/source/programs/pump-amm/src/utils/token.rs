use crate::*;

pub fn validate_self_transfer(
    source: &Pubkey,
    source_owner: &Pubkey,
    destination: &Pubkey,
    authority: &Pubkey,
) -> Result<()> {
    require!(source != destination || source_owner == authority, PumpAmmError::SelfTransferNotAllowed);
    Ok(())
}

pub fn transfer_checked<'info>(
    token_program: &AccountInfo<'info>,
    mint: &InterfaceAccount<'info, Mint>,
    source: &InterfaceAccount<'info, TokenAccount>,
    destination: &InterfaceAccount<'info, TokenAccount>,
    authority: &AccountInfo<'info>,
    amount: u64,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    validate_self_transfer(&source.key(), &source.owner, &destination.key(), authority.key)?;
    token_interface::transfer_checked(CpiContext::new_with_signer(
        token_program.clone(),
        token_interface::TransferChecked {
            from: source.to_account_info(),
            mint: mint.to_account_info(),
            to: destination.to_account_info(),
            authority: authority.clone(),
        },
        signer_seeds,
    ), amount, mint.decimals)
}

pub fn mint_to_pool<'info>(
    token_program: &Program<'info, Token2022>,
    mint: &InterfaceAccount<'info, Mint>,
    destination: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    pool: &Account<'info, Pool>,
) -> Result<()> {
    token_interface::mint_to(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            token_interface::MintTo {
                mint: mint.to_account_info(),
                to: destination.to_account_info(),
                authority: pool.to_account_info(),
            },
            &[&[
                b"pool",
                &pool.index.to_le_bytes(),
                pool.creator.as_ref(),
                pool.base_mint.as_ref(),
                pool.quote_mint.as_ref(),
                &[pool.pool_bump],
            ]],
        ),
        amount,
    )
}

pub fn transfer_from_pool<'info>(
    token_program: &AccountInfo<'info>,
    mint: &InterfaceAccount<'info, Mint>,
    source: &InterfaceAccount<'info, TokenAccount>,
    destination: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    pool: &Account<'info, Pool>,
) -> Result<()> {
    let pool_info = pool.to_account_info();
    let seeds: &[&[&[u8]]] = &[&[
        b"pool",
        &pool.index.to_le_bytes(),
        pool.creator.as_ref(),
        pool.base_mint.as_ref(),
        pool.quote_mint.as_ref(),
        &[pool.pool_bump],
    ]];
    transfer_checked(
        token_program,
        mint,
        source,
        destination,
        &pool_info,
        amount,
        seeds,
    )
}

#[inline(never)]
pub fn transfer_checked_to_account_info<'info>(
    token_program: &AccountInfo<'info>,
    mint: &InterfaceAccount<'info, Mint>,
    source: &InterfaceAccount<'info, TokenAccount>,
    destination: &AccountInfo<'info>,
    authority: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    validate_self_transfer(&source.key(), &source.owner, destination.key, authority.key)?;
    token_interface::transfer_checked(CpiContext::new(
        token_program.clone(),
        token_interface::TransferChecked {
            from: source.to_account_info(),
            mint: mint.to_account_info(),
            to: destination.clone(),
            authority: authority.clone(),
        },
    ), amount, mint.decimals)
}

pub fn transfer_from_pool_to_raw<'info>(
    token_program: &AccountInfo<'info>,
    mint: &InterfaceAccount<'info, Mint>,
    source: &InterfaceAccount<'info, TokenAccount>,
    pool: &Account<'info, Pool>,
    destination: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    validate_self_transfer(&source.key(), &source.owner, destination.key, &pool.key())?;
    token_interface::transfer_checked(CpiContext::new_with_signer(
        token_program.clone(),
        token_interface::TransferChecked {
            from: source.to_account_info(),
            mint: mint.to_account_info(),
            to: destination.clone(),
            authority: pool.to_account_info(),
        },
        &[&[
            b"pool",
            &pool.index.to_le_bytes(),
            pool.creator.as_ref(),
            pool.base_mint.as_ref(),
            pool.quote_mint.as_ref(),
            &[pool.pool_bump],
        ]],
    ), amount, mint.decimals)
}

static PUMP_MINT: Pubkey = Pubkey::new_from_array([12, 69, 247, 223, 141, 158, 114, 149, 98, 132, 147, 63, 109, 152, 183, 87, 3, 46, 131, 223, 132, 96, 79, 181, 225, 23, 255, 246, 29, 91, 18, 249]);

pub fn supported_mint(info: &AccountInfo, allow_extensions: bool) -> bool {
    if info.key() == PUMP_MINT {
        return true;
    }
    supported_mint_data(&info.to_account_info().data.borrow(), allow_extensions)
}

fn supported_mint_data(data: &[u8], allow_extensions: bool) -> bool {
    if data.len() == 82 {
        return true;
    }
    if data.len() < 167 {
        return false;
    }
    if data[82..165].iter().any(|byte| *byte != 0) || data[165] != 1 {
        return false;
    }
    let tlv = &data[166..];
    let mut offset = 0usize;
    let mut seen = 0u64;
    loop {
        let remaining = match tlv.get(offset..) {
            Some(remaining) => remaining,
            None => return false,
        };
        if remaining.len() < 2 {
            return true;
        }
        let kind = u16::from_le_bytes(remaining[..2].try_into().unwrap());
        if kind == 0 {
            return true;
        }
        if remaining.len() < 4 {
            return false;
        }
        let length = u16::from_le_bytes(remaining[2..4].try_into().unwrap()) as usize;
        let entry_size = length + 4;
        if entry_size > remaining.len() {
            return false;
        }
        if kind > 26 {
            return false;
        }
        let bit = 1u64 << kind;
        if bit & 0x0601_5052 != 0 {
            if !allow_extensions { return false; }
        } else if bit & 0x000c_0000 == 0 {
            return false;
        }
        if seen & bit != 0 {
            return false;
        }
        match kind {
            1 => { if length < 108 { return false; } },
            6 => { if length == 0 || remaining[4] != 1 { return false; } },
            14 => { if length < 64 || remaining[36..68].iter().any(|byte| *byte != 0) { return false; } },
            _ => {},
        }
        seen |= bit;
        offset = match offset.checked_add(entry_size) {
            Some(next) => next,
            None => return false,
        };
    }
}

#[inline(never)]
pub fn burn_from_user<'info>(
    token_program: &Program<'info, Token2022>,
    mint: &InterfaceAccount<'info, Mint>,
    source: &InterfaceAccount<'info, TokenAccount>,
    authority: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    token_interface::burn(CpiContext::new(
        token_program.to_account_info(),
        token_interface::Burn {
            mint: mint.to_account_info(),
            from: source.to_account_info(),
            authority: authority.clone(),
        },
    ), amount)
}
