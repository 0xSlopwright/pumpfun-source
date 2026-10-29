from pathlib import Path
import shutil
L=Path('/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol')
shutil.copytree(L/'source-costs-direct-gross',L/'source-costs-direct-gross-repeat')
print('Fresh repeat source copied without modifications')