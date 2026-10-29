# Correction: wrong successes do not establish changed account data

The preserved32-case negative-time baseline has20 outcome differences:17 wrong
successes and3 wrong custom6037 errors where the original program panics. For
all17 wrong-success fixtures, captured account data before and after are equal.
These fixtures therefore do not establish a committed account-data update.
Earlier wording that these17 cases "commit updates" or are "wrong commits" is
retracted. The correct claim is "17 wrong successes". Transaction fee lamport
changes do not establish the claimed incentive-account mutation.

The signed transaction bytes, result/error comparisons, original/candidate ELF
identities, case counts and passing selected-candidate replay are unchanged.
No sealed source, receipt, report or manifest was modified for this correction.
