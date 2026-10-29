use anchor_lang::prelude::*;
use anchor_spl::token_2022_extensions::transfer_fee::{harvest_withheld_tokens_to_mint, HarvestWithheldTokensToMint};

pub fn harvest_withheld<'info>(
    token_program: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
    source: &AccountInfo<'info>,
) -> Result<()> {
    harvest_withheld_tokens_to_mint(
        CpiContext::new(token_program.clone(), HarvestWithheldTokensToMint {
            token_program_id: token_program.clone(),
            mint: mint.clone(),
        }),
        vec![source.clone()],
    )
}

pub fn harvest_withheld_propagate<'info>(
    token_program: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
    source: &AccountInfo<'info>,
) -> Result<()> {
    harvest_withheld_tokens_to_mint(
        CpiContext::new(token_program.clone(), HarvestWithheldTokensToMint {
            token_program_id: token_program.clone(),
            mint: mint.clone(),
        }),
        vec![source.clone()],
    )?;
    Ok(())
}
