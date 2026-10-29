import type { NextConfig } from 'next';
import { resolve } from 'node:path';
const config: NextConfig = {
  // Keep the Node-only agent/Anchor dependency on its native Node require boundary.
  serverExternalPackages: ['@pump-fun/agent-payments-sdk'],
  turbopack: { root: resolve(import.meta.dirname, '../..') },
  async rewrites() { return [{ source: '/api/compat/:path*', destination: `${process.env.BACKEND_URL ?? 'http://127.0.0.1:3001'}/:path*` }]; },
};
export default config;
