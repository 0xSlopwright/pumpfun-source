import Link from 'next/link';
import { ForwardIcon } from './captured-icons';
import { Logomark } from './Logomark';
import { TokenInfoBar } from './TokenInfoBar';
import { SignInControl } from '@/app/auth/sign-in-control';
import { ICON_BUTTON_CLASS } from './styles';
import { BackButton, CreateMenuButton, SearchBox, SearchIconButton } from './TopBarControls';

/** The disabled `prepaint` buttons the capture renders before its auth state resolves. */
const PREPAINT_BUTTON =
  'flex h-8 shrink-0 cursor-default select-none items-center justify-center rounded-md bg-bg-accent px-[10px] leading-normal text-text-on-accent text-[13px] font-medium';
/** The captured prepaint sign-in geometry, made interactive for the local auth dialog. */
const SIGN_IN_BUTTON =
  'flex h-8 shrink-0 cursor-pointer select-none items-center justify-center rounded-md bg-bg-accent px-[10px] leading-normal text-text-on-accent text-[13px] font-medium whitespace-nowrap hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-accent';

/**
 * The sticky top bar of the captured shell. The mobile-app promotion banner the
 * capture renders above it is an excluded surface (app/AGENTS.md) and is omitted.
 * Signed-in slots stay in the markup and are hidden by `html[data-pf-auth=out]`.
 */
export function TopBar() {
  return (
    <header className="flex flex-col sticky top-0 left-0 z-20 bg-bg-primary border-b border-border-secondary">
      <div className="flex h-12 w-full items-center px-[var(--padding-x-main)] max-lg:px-4">
        <div className="flex h-full w-full items-center justify-between gap-x-3">
          <div className="flex h-full min-w-0 grow-[2] basis-0 items-center justify-start gap-x-3 max-lg:basis-auto">
            <Link className="items-center justify-center shrink-0 hidden max-md:flex" href="/">
              <Logomark />
            </Link>
            <div className="flex w-full items-center gap-x-2 max-lg:hidden">
              <BackButton />
              <div className="contents">
                <SearchBox />
              </div>
              <ForwardButton />
            </div>
            <div className="hidden max-lg:flex max-md:hidden">
              <BackButton />
            </div>
          </div>
          <div className="flex h-full min-w-0 grow-0 basis-auto items-center justify-end gap-x-2">
            <div className="hidden max-lg:block">
              <ForwardButton />
            </div>
            <div className="hidden max-lg:block">
              <SearchIconButton />
            </div>
            <span data-pf-auth-slot="in" className="inline-flex max-[480px]:hidden">
              <button className={PREPAINT_BUTTON} data-testid="topbar-deposit-prepaint" disabled type="button">
                Deposit
              </button>
            </span>
            <div className="max-[480px]:hidden">
              <CreateMenuButton />
            </div>
            <span data-pf-auth-slot="out" className="inline-flex">
              <SignInControl triggerClassName={SIGN_IN_BUTTON} />
            </span>
            <span data-pf-auth-slot="in" className="flex items-center gap-x-2">
              <span className="sr-only">Signed in</span>
              <span aria-hidden="true" className="flex h-8 min-w-0 max-w-full items-center gap-1.5 rounded-md border border-border-tertiary bg-transparent px-2.5 text-[13px] font-medium text-text-primary">
                <span className="h-3 w-14 rounded-md bg-bg-tertiary" />
                <span className="size-3.5 shrink-0 rounded-md bg-bg-tertiary" />
              </span>
              <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full">
                <span
                  data-pf-avatar-slot=""
                  className="inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border-tertiary bg-bg-tertiary bg-cover bg-center bg-no-repeat"
                />
              </span>
            </span>
          </div>
        </div>
      </div>
      <TokenInfoBar />
    </header>
  );
}

/** Captured disabled and hidden from assistive technology: there is no forward-history API. */
function ForwardButton() {
  return (
    <button type="button" disabled aria-hidden="true" tabIndex={-1} className={ICON_BUTTON_CLASS}>
      <ForwardIcon />
    </button>
  );
}
