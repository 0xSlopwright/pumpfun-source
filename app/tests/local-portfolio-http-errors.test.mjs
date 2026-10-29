import test from 'node:test';import assert from 'node:assert/strict';
import {localPortfolioPolicyClient} from '../packages/frontend/src/original-contracts/portfolio-read-policies/local-http.mjs';
test('local portfolio HTTP failures cannot become successful data after hooks',async()=>{
  const make=(response)=>localPortfolioPolicyClient({baseUrl:'https://local.invalid/v1/',fetchImplementation:async()=>response})()('GET /user-portfolio/dust-floor',{credentials:'omit',hooks:{afterResponse:[]}});
  await assert.rejects(make(new Response('{"error":"synthetic"}',{status:500})),/HTTP 500/);
  const client=localPortfolioPolicyClient({baseUrl:'https://local.invalid/v1/',fetchImplementation:async()=>new Response('{}',{status:401})})();
  assert.deepEqual(await client('GET /user-portfolio/dust-floor',{credentials:'omit',hooks:{afterResponse:[()=>Response.json({recovered:true})]}}),{recovered:true});
});
