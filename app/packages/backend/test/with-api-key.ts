import { buildApp as buildRawApp } from '../src/app.js';

// Every documented /v1 operation sits behind the API-key gate, so native-route
// tests send a well-formed key unless a request sets its own authorization.
export const TEST_API_KEY = `pf_live_${'A'.repeat(49)}`;

export function buildApp(...args: Parameters<typeof buildRawApp>) {
  const app = buildRawApp(...args);
  const inject = app.inject.bind(app);
  const withKey = (options: any) => {
    const request = typeof options === 'string' ? { url: options } : { ...options };
    request.headers = { authorization: `Bearer ${TEST_API_KEY}`, ...request.headers };
    return inject(request);
  };
  app.inject = withKey as typeof app.inject;
  return app;
}
