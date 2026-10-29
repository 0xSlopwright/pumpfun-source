import test from 'node:test';import assert from 'node:assert/strict';
import {localSummaryClient} from '../packages/frontend/src/original-contracts/portfolio-summary/local-http.mjs';
test('local scalar summary queries reject objects and nonfinite numbers before dispatch',async()=>{
  let calls=0;const client=localSummaryClient({baseUrl:'https://local.invalid/',fetchImplementation:async()=>{calls++;return Response.json({});}})();
  for(const value of [{},()=>{},Symbol('synthetic'),NaN,Infinity])await assert.rejects(client('GET /portfolio-summary',{query:{value}}),/scalar/);
  assert.equal(calls,0);await client('GET /portfolio-summary',{query:{string:'a',number:0,boolean:false,nullable:null}});assert.equal(calls,1);
});
