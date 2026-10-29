Fifth candidate legacy replay
=============================

Candidate7f501a865b83cf1dfbc4072191967162c700d3e7e487d2f6400e8d230f15ca62 passed all1,514 sealed legacy cases plus54 arithmetic collisions. All3,136 original/candidate transactions have redecoded valid signatures and identical paired messages. All recorded comparison fields agree. The original results of the1,514 inherited cases also agree with the original sealed packet. The54 generated cases bind their local producer hash and compare the captured original against this exact candidate.

verify_replay.py performs no VM execution and verifies the input inventory, scripts/observer, original/candidate/dependency hashes, outputs, signatures and message pairing. The preserved verification-1514.json predates the appended arithmetic cases; verification.json covers all1,568.
