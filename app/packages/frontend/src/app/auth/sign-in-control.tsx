"use client";

import { AuthControl } from "./auth-control";
import { unavailableAuthAdapter } from "./auth-model";

/** Sign-in stays unavailable; the opt-in wallet panel only reads a public address. */
export function SignInControl({
  triggerClassName,
}: {
  /** Presentation only; no provider, session or test-mode input is accepted. */
  triggerClassName?: string;
} = {}) {
  return (
    <AuthControl
      adapter={unavailableAuthAdapter}
      publicWallet
      triggerClassName={triggerClassName}
    />
  );
}
