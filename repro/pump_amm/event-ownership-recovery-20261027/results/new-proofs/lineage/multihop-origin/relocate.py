"""Relocate MultiHop's real items while preserving every function body.

Apply after an isolated multi_hop.rs body patch, or apply that patch to the
renamed module afterward. No source coordinates or blank filler are inserted.
"""
from pathlib import Path
import argparse, hashlib, json, re


def block(text, marker):
    start = text.index(marker)
    opening = text.index('{', start)
    depth = 0
    for i in range(opening, len(text)):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
    raise ValueError(marker)


def relocate(source):
    source = Path(source)
    root = source / 'programs/pump-amm/src'
    old = root / 'multi_hop.rs'
    original = old.read_text()
    assert original.startswith('//! Partial reconstruction')
    docs, body = original.split('use super::*;', 1)
    prefix, body = body.split('#[derive(Accounts)]', 1)
    # Preserve a body patch only when its import contract is understood. An
    # unexpected import must be incorporated explicitly rather than discarded.
    compact = lambda text: re.sub(r'\s+', '', text)
    expected = '''use anchor_lang::solana_program::{
        instruction::{AccountMeta, Instruction},
        program::{get_return_data, invoke_signed},
    };
    use std::collections::BTreeSet;'''
    alternate = expected.replace('program::{get_return_data, invoke_signed}', 'program::invoke_signed')
    assert compact(prefix) in {compact(expected), compact(alternate)}, 'Unexpected MultiHop imports'
    body = '#[derive(Accounts)]' + body
    main = block(body, '#[derive(Accounts)]\npub struct MultiHop')
    program = block(body, 'pub struct PumpProgram;\nimpl Id for PumpProgram')
    hop = block(body, '#[derive(Accounts)]\npub struct AmmHop')
    gates = block(body, '/// Fee endpoints carried together through an AMM leg.\n#[derive(Clone, Copy)]\npub struct HopFeeGates')
    fees = block(body, "pub struct HopFeeContext<'a, 'info>")
    for item in [main, program, hop, gates, fees]:
        assert body.count(item) == 1
        body = body.replace(item + '\n', '', 1)
    # Put each existing has_one constraint on its own line for readability.
    hop = hop.replace('    #[account(mut,has_one=base_mint @ PumpAmmError::InvalidBaseMint,has_one=quote_mint @ PumpAmmError::InvalidQuoteMint,has_one=pool_base_token_account @ PumpAmmError::InvalidPoolBaseTokenAccount,has_one=pool_quote_token_account @ PumpAmmError::InvalidPoolQuoteTokenAccount)]', '    #[account(mut,\n        has_one = base_mint @ PumpAmmError::InvalidBaseMint,\n        has_one = quote_mint @ PumpAmmError::InvalidQuoteMint,\n        has_one = pool_base_token_account @ PumpAmmError::InvalidPoolBaseTokenAccount,\n        has_one = pool_quote_token_account @ PumpAmmError::InvalidPoolQuoteTokenAccount,\n    )]')
    body = body.lstrip('\n')
    # Removing standalone item blocks leaves their separating blank lines.
    body = body.replace('\n\n\n', '\n\n')
    needs_return = 'fn read_cpi_return<' in body
    header = '''use anchor_lang::{
    accounts::{
        account::Account,
        interface_account::InterfaceAccount,
        program::Program,
        signer::Signer,
        unchecked_account::UncheckedAccount,
    },
    prelude::{
        AccountInfo, Clock, Context, CpiContext, Id, Key, Pubkey, Rent, Result,
        SolanaSysvar, System, ToAccountInfo,
    },
    solana_program::{
        instruction::{AccountMeta, Instruction},
        program::{get_return_data, invoke_signed},
    },
    AccountDeserialize, Accounts, AccountsExit, AnchorDeserialize,
    err, error, require, require_eq, require_gt, require_gte, require_keys_eq, require_keys_neq,
};
use anchor_spl::{
    token::Token,
    token_2022::Token2022,
    token_interface::{self, Mint, TokenAccount},
};
use crate::{
    quote_transfer_fee,
    state::{GlobalConfig, Pool, UserVolumeAccumulator},
    trade::{BuyEvent, SellEvent, FEE_OWNER, PUMP, PumpAmmProgram, TradeFeeConfig},
    PumpAmmError,
};
use std::collections::BTreeSet;
'''
    if not needs_return:
        header = header.replace('program::{get_return_data, invoke_signed}', 'program::invoke_signed')
        header = header.replace('AccountsExit, AnchorDeserialize', 'AccountsExit')
    target = root / 'instructions/swap/multi_hop_swap.rs'
    assert not target.exists()
    # Independent hop types and the program marker precede the transaction
    # context; the fee context follows the transaction context it borrows.
    output = docs + header + '\n' + '\n\n'.join([program, hop, gates, main, fees]) + '\n\n' + body
    target.write_text(output)
    old.write_text('pub(crate) use crate::instructions::swap::multi_hop_swap::*;\n')
    modules = root / 'instructions/swap/mod.rs'
    text = modules.read_text()
    assert 'pub mod multi_hop_swap;' not in text
    modules.write_text(text.rstrip() + '\npub mod multi_hop_swap;\n')
    return {
        'old_sha256': hashlib.sha256(original.encode()).hexdigest(),
        'new_sha256': hashlib.sha256(output.encode()).hexdigest(),
        'original_accounts_derive': original[:original.index(main)].count('\n') + 1,
        'new_accounts_derive': output[:output.index(main)].count('\n') + 1,
        'manual_return_helper_retained': needs_return,
        'scope': __doc__,
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    result = relocate(args.source)
    if args.report:
        args.report.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
