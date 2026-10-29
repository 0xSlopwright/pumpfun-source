/** Static-only source witnesses. Never imports or evaluates captured factories. */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { openCorpus, findNodes, exactlyOne, propertyName } from '../source.mjs';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const corpus = await openCorpus(root);
const registry = await corpus.factory(255220, { source: 'evidence/web/objects/08521d498c5b9e8f.js' });
const keys = await corpus.factory(716464, { source: 'evidence/web/objects/08521d498c5b9e8f.js' });
const adapter = await corpus.factory(785552, { source: 'evidence/web/objects/bb8d7a9653ab0cc0.js' });
assert.equal(registry.provenance.sha256, '62c580d029f053e1669a50391e71f29f6f8d5a328a8fc44938a7167e0be03a4c');
assert.equal(keys.provenance.sha256, '7e1c970abe23cf75263981534d9153f3694e0b6cc2c14bbb7b5c3253a3271d90');
assert.equal(adapter.provenance.sha256, 'fc18fd775817f77dbf19651ed9cc543010068dcb3b939f28cd53ab76a3db8e93');
const witness = (factory, predicate, label) => factory.witness(exactlyOne(findNodes(factory.node, predicate), label), label);
const namedFunction = (factory, name, label) => witness(factory, n => n.type === 'FunctionDeclaration' && n.id?.name === name, label);
const assignment = (name, label) => witness(adapter, n => n.type === 'AssignmentExpression' && n.left.type === 'Identifier' && n.left.name === name, label);
const result = {
  authority: 'Static captured protocol evidence; independent local public-address UI, not original auth/Privy equivalence',
  route: 'Shared SignInControl mounted by TopBar on /explore and included shell routes',
  factories: [registry.provenance, keys.provenance, adapter.provenance],
  witnesses: [
    namedFunction(registry, 'o', 'Wallet Standard register listener and app-ready dispatch'),
    namedFunction(registry, 'c', 'Object-identity registry and unregister closure'),
    witness(adapter, n => n.type === 'ClassDeclaration' && n.id?.name === 'tS', 'Used standard wallet adapter with change subscription/disconnect'),
    assignment('ew', 'Explicit connect (no argument) or separate silent autoConnect; first account'),
    assignment('ep', 'Account address parsed as Solana PublicKey; not ownership authentication'),
    witness(adapter, n => n.type === 'VariableDeclarator' && n.id.name === 't_' && n.init?.type === 'CallExpression' && n.init.arguments[0]?.value === 255220, 'Actual registry import'),
  ],
  featureKeys: ['standard:connect', 'standard:disconnect', 'standard:events'],
  localPolicy: ['Opt-in discovery', 'Only connect/disconnect/change ports', 'No silent or automatic reconnect', 'No accounts read until explicit connect resolves', 'No signing or server session', 'No persistence; close/route/unmount forgets', 'Only protocol-v1 Solana metadata; first Solana account must be canonical 32-byte base58', 'No remote wallet icons or legacy navigator.wallets migration'],
  limits: ['Protocol-compatible extension fixture is synthetic; no live wallet or authenticated upstream oracle', 'No claim of original wallet selection, provider tenant configuration, consent text or visual parity', 'Captured adapter exposes additional signing and storage paths; this UI intentionally does not implement them'],
};
const output = `${JSON.stringify(result, null, 2)}\n`;
const target = new URL('../../../packages/frontend/PUBLIC-WALLET-SOURCE.json', import.meta.url);
if (process.argv.includes('--check')) assert.equal(await readFile(target, 'utf8'), output, 'public-wallet source witnesses changed');
else await writeFile(target, output);
console.log('Public-wallet captured source witnesses verified (AST-only; 3 factories, 6 fragments)');
