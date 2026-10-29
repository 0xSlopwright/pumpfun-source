exec(open(__file__.rsplit('/',1)[0]+'/common.py').read())
OPTS='let (user_quote,curve_quote)=if is_sol{(None,None)}else{let curve_quote=Some(a.associated_quote_bonding_curve.as_ref());(Some(a.associated_quote_user.as_ref()),curve_quote)};'
EDITS=[(OLD_MATCH,'    match if is_sol{add(pool_quote,total_buyback)?}else{pool_quote}{user_quote_in=>{'+OPTS+CALL+'?}}\n')]
