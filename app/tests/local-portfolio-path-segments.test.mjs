import test from 'node:test';import assert from 'node:assert/strict';
import {localPortfolioPolicyClient} from '../packages/frontend/src/original-contracts/portfolio-read-policies/local-http.mjs';
import {localMintPositionClient} from '../packages/frontend/src/original-contracts/positions-by-mint/local-http.mjs';
test('dot path parameters cannot navigate local adapters to another operation',async()=>{
  let calls=0;const fetchImplementation=async()=>{calls++;return Response.json({});};
  const policy=localPortfolioPolicyClient({baseUrl:'https://local.invalid/v1/',fetchImplementation})();
  const mint=localMintPositionClient({baseUrl:'https://local.invalid/v1/',fetchImplementation})();
  for(const userId of ['.','..']){
    await assert.rejects(policy('GET /user-portfolio/{userId}',{params:{userId},query:{},hooks:{afterResponse:[]}}),/path segment/);
    await assert.rejects(mint('GET /user-positions/{userId}',{params:{userId},query:{mints:[],updatesLimit:0},hooks:{afterResponse:[]}}),/path segment/);
  }
  assert.equal(calls,0);
});
