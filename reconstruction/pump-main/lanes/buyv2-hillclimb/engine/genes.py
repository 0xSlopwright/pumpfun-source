"""Gene-based source generator for buy_v2.rs (lane buyv2-hillclimb).

The base file is the committed worktree buy_v2.rs (frozen-best seed).  Regions of the base are
replaced by text generated from a genome; every generated region keeps its exact line count, and
no generated region contains a line!()-carrying error site except at its original line.
"""
from pathlib import Path
import json

BASE = Path(__file__).resolve().parent / 'base_buy_v2.rs'

# ---------------------------------------------------------------- exact-quote tail (lines 998..1036)
EQ_TAIL = (998, 1036)
EQ_TOP = 546

EV_A = ['user', 'mint', 'sol_amount', 'token_amount', 'is_buy', 'timestamp',
        'virtual_sol_reserves', 'virtual_token_reserves', 'real_sol_reserves', 'real_token_reserves',
        'fee_recipient', 'fee_basis_points', 'fee', 'creator',
        'holder_rewards_bps', 'holder_rewards', 'creator_fee_basis_points', 'creator_fee',
        'track_volume', 'total_unclaimed_tokens', 'total_claimed_tokens', 'current_sol_volume', 'last_update_timestamp',
        'ix_name', 'mayhem_mode', 'cashback_fee_basis_points', 'cashback',
        'shareholders', 'buyback_fee_basis_points', 'buyback_fee',
        'quote_mint', 'quote_amount', 'virtual_quote_reserves', 'real_quote_reserves',
        'creator_fee_unclaimed', 'unparsed_trailing_field']
EV_F = ['user', 'mint', 'sol_amount', 'token_amount', 'is_buy', 'timestamp',
        'real_sol_reserves', 'virtual_token_reserves', 'virtual_sol_reserves', 'real_token_reserves',
        'fee_recipient', 'fee_basis_points', 'fee', 'creator',
        'creator_fee_basis_points', 'creator_fee', 'holder_rewards_bps', 'holder_rewards',
        'track_volume', 'total_unclaimed_tokens', 'total_claimed_tokens', 'current_sol_volume', 'last_update_timestamp',
        'ix_name', 'mayhem_mode', 'cashback_fee_basis_points', 'cashback',
        'buyback_fee', 'buyback_fee_basis_points', 'shareholders',
        'quote_mint', 'quote_amount', 'virtual_quote_reserves', 'real_quote_reserves',
        'creator_fee_unclaimed', 'unparsed_trailing_field']
assert sorted(EV_A) == sorted(EV_F)

SNAP_A = ['vtr', 'vqr', 'rtr', 'rqr', 'creator', 'quote_mint', 'ts', 'tut', 'tct', 'csv', 'lut', 'sh', 'is_sol']
SNAP_F = ['creator', 'quote_mint', 'vtr', 'vqr', 'rtr', 'rqr', 'ts', 'tut', 'tct', 'csv', 'lut', 'sh', 'is_sol']


def ev_expr(f, g, h):
    """h: handler-specific names: amount, fee (transfer fee option), ix."""
    qm = 'c.quote_mint' if g.get('ev_qm_field') == 'c' else 'quote_mint'
    fr = 'a.fee_recipient.key()' if g.get('ev_fr') == 'a' else 'fee_recipient.key()'
    ix = f'"{h["ix"]}".to_string()' if g.get('ix') == 'to_string' else f'"{h["ix"]}".into()'
    E = {
        'user': 'a.user.key()', 'mint': 'a.base_mint.key()', 'sol_amount': 'if is_sol{quote}else{0}',
        'token_amount': h['amount'], 'is_buy': 'true', 'timestamp': None,
        'virtual_sol_reserves': 'if is_sol{virtual_quote_reserves}else{0}', 'virtual_token_reserves': None,
        'real_sol_reserves': 'if is_sol{real_quote_reserves}else{0}', 'real_token_reserves': None,
        'fee_recipient': fr, 'fee_basis_points': 'protocol_fee_bps', 'fee': 'pf', 'creator': None,
        'holder_rewards_bps': 'if c.is_holder_reward{creator_fee_bps}else{0}', 'holder_rewards': 'if c.is_holder_reward{cf}else{0}',
        'creator_fee_basis_points': 'if c.is_cashback_coin{0}else{creator_fee_bps}', 'creator_fee': 'if c.is_cashback_coin{0}else{cf}',
        'track_volume': 'false', 'total_unclaimed_tokens': None, 'total_claimed_tokens': None,
        'current_sol_volume': None, 'last_update_timestamp': None,
        'ix_name': ix, 'mayhem_mode': 'c.is_mayhem_mode',
        'cashback_fee_basis_points': 'if c.is_cashback_coin{creator_fee_bps}else{0}', 'cashback': 'if c.is_cashback_coin{cf}else{0}',
        'shareholders': None, 'buyback_fee_basis_points': 'if c.is_mayhem_mode{0}else{a.global.buyback_basis_points}',
        'buyback_fee': f'crate::transfer_fee_recovered::post_fee_amount(&{h["fee"]},bf)?',
        'quote_mint': qm if qm != 'quote_mint' else None, 'quote_amount': 'quote',
        'virtual_quote_reserves': None, 'real_quote_reserves': None,
        'creator_fee_unclaimed': 'c.creator_fee', 'unparsed_trailing_field': 'quote_transfer_fee',
    }
    v = E[f]
    return f if v is None else f'{f}:{v}'


def snap_stmt(s, g):
    uva = 'uva' if g.get('uva') == 'bind' else 'a.user_volume_accumulator'
    return {
        'vtr': 'let virtual_token_reserves=c.virtual_token_reserves;',
        'vqr': 'let virtual_quote_reserves=c.virtual_quote_reserves;',
        'rtr': 'let real_token_reserves=c.real_token_reserves;',
        'rqr': 'let real_quote_reserves=c.real_quote_reserves;',
        'creator': 'let creator=c.creator;', 'quote_mint': 'let quote_mint=c.quote_mint;',
        'ts': 'let timestamp=Clock::get()?.unix_timestamp;',
        'tut': f'let total_unclaimed_tokens={uva}.total_unclaimed_tokens;',
        'tct': f'let total_claimed_tokens={uva}.total_claimed_tokens;',
        'csv': f'let current_sol_volume={uva}.current_sol_volume;',
        'lut': f'let last_update_timestamp={uva}.last_update_timestamp;',
        'sh': 'let shareholders=crate::distribution::sharing_config_shareholders(&a.sharing_config.to_account_info())?.unwrap_or_default();',
        'is_sol': ('let c=&a.bonding_curve;' if g.get('rebind_c') == 'yes' else '') + ('let is_sol=c.quote_mint==Pubkey::default();' if g.get('is_sol_src') == 'c' else 'let is_sol=quote_mint==Pubkey::default();'),
    }[s]


def snapshot_lines(g):
    order = g.get('snap_order') or SNAP_A
    out = []
    cur = 'let c=&a.bonding_curve;'
    for s in order:
        if s == 'tut' and g.get('uva') == 'bind':
            cur += 'let uva=&a.user_volume_accumulator;'
        cur += snap_stmt(s, g)
        if g.get('snap_lines') == 'split' and s in ('rqr', 'ts', 'sh') :
            out.append(' ' + cur); cur = ''
    if cur:
        out.append(' ' + cur)
    return out


def payments(g, h):
    """Lines for the payment section (cashback/creator branch, curve payment, split, recipients)."""
    sp_direct = 'system_program.as_ref()' if g.get('sysp') == 'bind' else 'a.system_program.as_ref()'
    sp_wrap = 'system_program' if g.get('sysp') == 'bind' else '&a.system_program'
    nat = lambda x: f'if native{{None}}else{{Some(a.{x}.as_ref())}}'
    def own(to, dst):
        if g.get('pay_own') == 'wrap':
            return f'pay_from_user_owned(native,{sp_wrap},&a.user,{to},cf,&a.quote_token_program,&a.quote_mint,{nat("associated_quote_user")},{nat(dst)})?;'
        return f'crate::user_quote_payments::transfer_from_user_owned(native,{sp_direct},&a.user,{to},cf,&a.quote_token_program,a.quote_mint.decimals,a.quote_mint.as_ref().as_ref(),{nat("associated_quote_user")},{nat(dst)})?;'
    cash = [f'    {own("a.user_volume_accumulator.to_account_info()", "associated_user_volume_accumulator")}',
            '    crate::token_incentives::volume_accumulator::record_cashback_earned(&mut a.user_volume_accumulator,cf,native)?;']
    op = g.get('own_pre', 'none')
    if op == 'none':
        cre = ['    native_payments::ensure_rent_exempt(0,&a.system_program,&a.user,&a.creator_vault)?;',
               f'    {own("a.creator_vault.to_account_info()", "associated_creator_vault")}']
    elif op == 'to':
        cre = ['    let creator_vault=a.creator_vault.to_account_info();native_payments::ensure_rent_exempt(0,&a.system_program,&a.user,&a.creator_vault)?;',
               f'    {own("creator_vault", "associated_creator_vault")}']
    else:  # opts: bind source/destination options first
        cre = ['    let (from,dst)=(if native{None}else{Some(a.associated_quote_user.as_ref())},if native{None}else{Some(a.associated_creator_vault.as_ref())});native_payments::ensure_rent_exempt(0,&a.system_program,&a.user,&a.creator_vault)?;',
               '    ' + own("a.creator_vault.to_account_info()", "associated_creator_vault").replace(nat("associated_quote_user") + ',' + nat("associated_creator_vault"), 'from,dst')]
    L = []
    if g.get('sysp') == 'bind':
        L.append(' let system_program=&a.system_program;')
    if g.get('cforder') == 'creator_first':
        L += [' if cf>0{', '   if !a.bonding_curve.is_cashback_coin{'] + cre + ['   }else{'] + cash + ['   }', '  }']
    else:
        L += [' if cf>0{', '   if a.bonding_curve.is_cashback_coin{'] + cash + ['   }else{'] + cre + ['   }', '  }']
    amt = h['gross'] if g.get('payamt') == 'gross' else f'if native{{quote}}else{{{h["gross"]}}}'
    if g.get('pay_user') == 'wrap':
        L.append(f'  pay_from_user(native,{sp_wrap},&a.user,a.bonding_curve.as_ref(),{amt},&a.quote_token_program,&a.quote_mint,{nat("associated_quote_user")},{nat("associated_quote_bonding_curve")})?;')
    else:
        L.append(f'  crate::trade::user_quote_payments::transfer_from_user(native,{sp_direct},&a.user,a.bonding_curve.as_ref(),{amt},&a.quote_token_program,a.quote_mint.decimals,a.quote_mint.as_ref().as_ref(),{nat("associated_quote_user")},{nat("associated_quote_bonding_curve")})?;')
    L.append('  let (bf,protocol_fee)=recipient_payments::split_protocol_fee(&a.global,pf,a.bonding_curve.is_mayhem_mode);')
    for to, amt2, dst in (('&fee_recipient', 'protocol_fee', 'associated_quote_fee_recipient'), ('&buyback_fee_recipient', 'bf', 'associated_quote_buyback_fee_recipient')):
        if g.get('pay_recip') == 'wrap':
            L.append(f'  pay_from_user_recipient(native,{sp_wrap},&a.user,{to},{amt2},&a.quote_token_program,&a.quote_mint,{nat("associated_quote_user")},{nat(dst)})?;')
        else:
            L.append(f'  crate::user_quote_payments::transfer_from_user_recipient(native,{sp_direct},&a.user,{to},{amt2},&a.quote_token_program,a.quote_mint.decimals,a.quote_mint.as_ref().as_ref(),{nat("associated_quote_user")},{nat(dst)})?;')
    return L


def tail_lines(g, h):
    """Generic post-apply_buy tail shared by both handlers."""
    if g.get('xfer') == 'wrap':
        btp, bm = ('base_token_program', 'base_mint') if g.get('bindbase') == 'yes' else ('&a.base_token_program', '&a.base_mint')
        L = [f'  move_curve_tokens({btp},&a.associated_base_bonding_curve,&a.associated_base_user,&a.bonding_curve,{bm},{h["amount"]},&[&[b"bonding-curve",{bm}.key().as_ref(),&[ctx.bumps.bonding_curve]]])?;']
    else:
        L = [f'  token_transfers::transfer_curve_tokens(&a.base_token_program,&a.associated_base_bonding_curve,&a.associated_base_user,&a.bonding_curve,a.base_mint.decimals,a.base_mint.as_ref().as_ref(),{h["amount"]},&[&[b"bonding-curve",a.base_mint.key().as_ref(),&[ctx.bumps.bonding_curve]]])?;']
    L.append('  if a.user.key()==a.global.whitelist_pda{a.associated_base_bonding_curve.reload()?;a.associated_base_user.reload()?;let quote_mint=a.bonding_curve.quote_mint;a.bonding_curve.sync_virtual_quote_reserves(a.associated_base_bonding_curve.amount,a.associated_base_user.amount,&quote_mint)?;}')
    L.append('  if a.user_volume_accumulator.user==Pubkey::default(){a.user_volume_accumulator.user=a.user.key();}')
    L += payments(g, h)
    L += snapshot_lines(g)
    order = g.get('ev_order') or EV_A
    L.append('  let ev=TradeEvent{' + ','.join(ev_expr(f, g, h) for f in order) + '};')
    L.append('  emit!(ev);emit_cpi!(ev);')
    if g.get('cev') == 'F':
        ce = 'crate::trade_types::CompleteEvent{mint:a.base_mint.key(),user:a.user.key(),bonding_curve:a.bonding_curve.key(),quote_mint:a.bonding_curve.quote_mint,timestamp}'
    else:
        ce = 'crate::trade_types::CompleteEvent{user:a.user.key(),mint:a.base_mint.key(),bonding_curve:a.bonding_curve.key(),timestamp,quote_mint:a.bonding_curve.quote_mint}'
    L.append('  let a=&mut *ctx.accounts;if a.bonding_curve.real_token_reserves==0{a.bonding_curve.complete=true;let event=' + ce + ';emit!(event);emit_cpi!(event);}')
    L.append('  let a=&mut *ctx.accounts;crate::trade_types::prepare_bonding_curve(&a.bonding_curve,&a.system_program,&a.user)?;')
    return L


EQ_H = {'amount': 'amount', 'fee': 'transfer_fee', 'ix': 'buy_exact_quote_in', 'gross': 'gross_quote'}
BH_H = {'amount': 'input', 'fee': 'fee', 'ix': 'buy', 'gross': 'gross'}

# genomes reproducing the current base text (semantically; base == frozen-best file)
EQ_MAIN = {'xfer': 'direct', 'bindbase': 'no', 'sysp': 'none', 'cforder': 'cash_first', 'pay_own': 'direct',
           'pay_user': 'direct', 'payamt': 'cond', 'pay_recip': 'direct', 'uva': 'none', 'rebind_c': 'no',
           'snap_order': SNAP_A, 'snap_lines': 'one', 'ev_order': EV_A, 'ev_qm_field': 'local', 'ev_fr': 'local',
           'ix': 'into', 'cev': 'A'}
BH_FROZEN = {'xfer': 'wrap', 'bindbase': 'yes', 'sysp': 'bind', 'cforder': 'creator_first', 'pay_own': 'wrap',
             'pay_user': 'wrap', 'payamt': 'gross', 'pay_recip': 'wrap', 'uva': 'bind', 'rebind_c': 'yes',
             'snap_order': SNAP_F, 'snap_lines': 'split', 'ev_order': EV_F, 'ev_qm_field': 'c', 'ev_fr': 'a',
             'ix': 'to_string', 'cev': 'F'}

BH_TAIL = (503, 529)
BH_TOP = 180


def fit(lines, n, where):
    assert len(lines) <= n, (where, len(lines), n)
    return lines + [''] * (n - len(lines))


def render(eq, bh):
    base = BASE.read_text().split('\n')
    out = list(base)
    # top-of-function bindings
    top = ' let a=&mut *ctx.accounts;let fee_recipient=&a.fee_recipient;let buyback_fee_recipient=&a.buyback_fee_recipient;'
    out[EQ_TOP - 1] = top + ('let (base_token_program,base_mint)=(&a.base_token_program,&a.base_mint);' if eq.get('bindbase') == 'yes' else '')
    out[BH_TOP - 1] = top + ('let (base_token_program,base_mint)=(&a.base_token_program,&a.base_mint);' if bh.get('bindbase') == 'yes' else '')
    s, e = EQ_TAIL
    out[s - 1:e] = fit(tail_lines(eq, EQ_H), e - s + 1, 'eq')
    s, e = BH_TAIL
    out[s - 1:e] = fit(tail_lines(bh, BH_H), e - s + 1, 'bh')
    assert len(out) == len(base)
    return '\n'.join(out)


# ---------------------------------------------------------------- admit / transfer-fee block
EQ_ADMIT = (773, 780)
BH_ADMIT = (359, 369)
EQ_VAL = (771, 772)
BH_VAL = (357, 358)
ADM_DEF = {
    'eq': {'adm_struct': 'one', 'adm_scope': 'inner', 'adm_refs': 'asref', 'adm_none': 'None', 'adm_fr': 'local', 'adm_chk': 'asref', 'val': 'local'},
    'bh': {'adm_struct': 'two', 'adm_scope': 'outer', 'adm_refs': 'amp', 'adm_none': 'const', 'adm_fr': 'a', 'adm_chk': 'amp', 'val': 'a'},
}
ADM_KEYS = list(ADM_DEF['eq'])


def admit_lines(g, h, n):
    fee = h['fee']
    acc = (lambda x: f'a.{x}.as_ref()') if g['adm_refs'] == 'asref' else (lambda x: f'&a.{x}')
    sp = 'a.system_program.as_ref()' if g['adm_refs'] == 'asref' else '&a.system_program'
    fr = 'fee_recipient' if g['adm_fr'] == 'local' else 'a.fee_recipient'
    bfr = 'buyback_fee_recipient' if g['adm_fr'] == 'local' else 'a.buyback_fee_recipient'
    usr = 'a.user.as_ref()' if g['adm_chk'] == 'asref' else '&a.user'
    keys = 'let quote_mint=a.quote_mint.key();let quote_token_program=a.quote_token_program.key();'
    infos = 'let mint_info=a.quote_mint.to_account_info();let token_program_info=a.quote_token_program.to_account_info();'
    def adm(dst, auth, create):
        return f'admit_associated_token_account({acc(dst)},{auth},quote_mint,quote_token_program,&mint_info,&token_program_info,{create},a.user.as_ref(),{sp})?;'
    body = [adm('associated_quote_bonding_curve', '&a.bonding_curve.to_account_info()', 'false') +
            f'check_token_account(&a.associated_quote_user,{usr},quote_mint,quote_token_program)?;',
            adm('associated_creator_vault', '&a.creator_vault', 'true') + adm('associated_user_volume_accumulator', '&a.user_volume_accumulator.to_account_info()', 'true'),
            adm('associated_quote_fee_recipient', f'&{fr}.to_account_info()', 'true') + adm('associated_quote_buyback_fee_recipient', f'&{bfr}.to_account_info()', 'true')]
    if g['adm_scope'] == 'inner':
        pre, post = '  {' + keys + infos, '}'
    elif g['adm_scope'] == 'outer':
        pre, post = '  ' + keys + '{' + infos, '}'
    else:
        pre, post = '  ' + keys + infos, ''
    none = 'NO_FEE' if g['adm_none'] == 'const' else 'None'
    nat = ('const NO_FEE:Option<crate::trade::native_transfer_fee::Fee>=None;' if none == 'NO_FEE' else '') + 'let native=a.bonding_curve.quote_mint==Pubkey::default();'
    get = f'crate::transfer_fee_recovered::get_transfer_fee(&a.quote_mint.to_account_info())?'
    last = f' }}else{{require!(a.quote_mint.key()==WSOL,PumpError::UnsupportedQuoteMint);{none}}};'
    if g['adm_struct'] == 'one':
        L = [' ' + nat, f' let {fee}=if !native{{', pre] + ['  ' + b for b in body] + ['  ' + post + get]
    else:
        L = [' ' + nat, ' if !native{', pre] + ['  ' + b for b in body] + ['  ' + post + f'}}let {fee}=if !native{{{get}']
    assert len(L) + 1 <= n, (len(L), n)
    return L + [''] * (n - 1 - len(L)) + [last]


def val_lines(base_lines, g):
    l1, l2 = base_lines
    for loc, a_ in (('fee_recipient,&a.global', '&a.fee_recipient,&a.global'),):
        if g['val'] == 'a': l1 = l1.replace('(' + loc, '(' + a_) if '(&a.fee_recipient' not in l1 else l1
        else: l1 = l1.replace('(' + a_, '(' + loc)
    if g['val'] == 'a': l2 = l2.replace('(&buyback_fee_recipient.key()', '(&a.buyback_fee_recipient.key()')
    else: l2 = l2.replace('(&a.buyback_fee_recipient.key()', '(&buyback_fee_recipient.key()')
    return [l1, l2]


_render0 = render


def render(eq, bh):
    out = _render0(eq, bh).split('\n')
    for g, h, (s, e), (vs, ve), which in ((eq, EQ_H, EQ_ADMIT, EQ_VAL, 'eq'), (bh, BH_H, BH_ADMIT, BH_VAL, 'bh')):
        if any(k in g for k in ADM_KEYS):
            gg = dict(ADM_DEF[which]); gg.update({k: g[k] for k in ADM_KEYS if k in g})
            out[s - 1:e] = admit_lines(gg, h, e - s + 1)
            out[vs - 1:ve] = val_lines(out[vs - 1:ve], gg)
    return '\n'.join(out)


# ---------------------------------------------------------------- line-local substitution genes
SUBST = {
    'bh_wl_cmp': [(470, 'if a.global.whitelist_pda==a.user.key(){', 'if a.user.key()==a.global.whitelist_pda{')],
    'bh_wl_ok': [(470, '{Ok((0,0,0,0))}else{', '{(0,0,0,0)}else{'), (472, ' )}?;', ' )?};')],
    'bh_ckadd_andthen': [(494, 'require_gte!(limit,gross.checked_add(pf)', 'require_gte!(limit,gross.checked_add(pf).and_then(|t|t.checked_add(cf)).ok_or_else(||error!(PumpError::Overflow))?,PumpError::TooMuchSolRequired);'),
                         (498, '  .ok_or_else(||error!(PumpError::Overflow))?', ''), (499, '  .checked_add(cf)', ''),
                         (500, '  .ok_or_else(||error!(PumpError::Overflow))?,PumpError::TooMuchSolRequired);', '')],
    'bh_qtf_after_fees': [(469, ' let quote_transfer_fee=gross.checked_sub(quote).ok_or_else(||error!(PumpError::Overflow))?;', ''),
                          (473, '// layout-pad', ' let quote_transfer_fee=gross.checked_sub(quote).ok_or_else(||error!(PumpError::Overflow))?;')],
    'bh_wl_bind': [(470, ' let (pf,cf,protocol_fee_bps,creator_fee_bps)=if a.global.whitelist_pda==a.user.key(){', ' let whitelisted=a.global.whitelist_pda==a.user.key();let (pf,cf,protocol_fee_bps,creator_fee_bps)=if whitelisted{')],
    'bh_ckadd_pf_cf_first': [(494, 'require_gte!(limit,gross.checked_add(pf)', 'require_gte!(limit,gross.checked_add(pf.checked_add(cf).ok_or_else(||error!(PumpError::Overflow))?)'), (499, '  .checked_add(cf)', ''), (500, '  .ok_or_else(||error!(PumpError::Overflow))?,PumpError::TooMuchSolRequired);', ',PumpError::TooMuchSolRequired);')],
    'eq_tbps_ne': [(884, 'if c.creator==Pubkey::default(){0}else{creator_fee_bps}', 'if c.creator!=Pubkey::default(){creator_fee_bps}else{0}')],
    'eq_partial_first': [(950, 'if computed>c.real_token_reserves && partial{', 'if partial && computed>c.real_token_reserves{')],
    'eq_wl_cmp': [(874, 'if a.global.whitelist_pda==a.user.key(){', 'if a.user.key()==a.global.whitelist_pda{')],
}

_render1 = render


def render(eq, bh):
    out = _render1(eq, bh).split('\n')
    for g, pre in ((eq, 'eq_'), (bh, 'bh_')):
        for name, edits in SUBST.items():
            if name.startswith(pre) and g.get(name) == 'on':
                for ln, old, new in edits:
                    if not (out[ln - 1].count(old) == 1 and (old != '// layout-pad' or out[ln - 1] == old)):
                        raise ValueError(f'gene conflict {name}@{ln}')
                    out[ln - 1] = out[ln - 1].replace(old, new)
    return '\n'.join(out)
