import type { AuthProfileClient, UnverifiedSessionResponse } from './index.js';
export function t<T>(client: AuthProfileClient<T>): Promise<UnverifiedSessionResponse<T>>;
