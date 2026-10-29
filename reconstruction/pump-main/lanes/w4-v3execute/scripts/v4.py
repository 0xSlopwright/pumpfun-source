exec(open(__file__.rsplit('/',1)[0]+'/common.py').read())
AMT='let user_quote_in=if is_sol{add(pool_quote,total_buyback)?}else{pool_quote};'
OPTS='let (user_quote,curve_quote)=if is_sol{(None,None)}else{let curve_quote=Some(a.associated_quote_bonding_curve.as_ref());(Some(a.associated_quote_user.as_ref()),curve_quote)};'
EDITS=[(OLD_MATCH,'    {'+AMT+'\n    '+OPTS+'\n    '+CALL+'?;}\n')]
