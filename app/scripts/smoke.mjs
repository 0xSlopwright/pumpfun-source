import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const checks=[];
for(const route of ['/','/explore','/leaderboard','/live','/go','/mayhem','/holder-rewards','/portfolio','/create']){
 const r=await fetch(`http://127.0.0.1:3000${route}`);assert.equal(r.status,200,route);assert.match(await r.text(),/Pump reconstruction/);checks.push({route,status:r.status});
}
for(const route of ['/pump-token','/coin/example']){
 const r=await fetch(`http://127.0.0.1:3000${route}`);assert.equal(r.status,404,route);checks.push({route,status:r.status});
}
for(const route of ['http://127.0.0.1:3001/health','http://127.0.0.1:3000/api/compat/health']){
 const r=await fetch(route);assert.equal(r.status,200);assert.equal((await r.json()).compatibility,'unqualified');checks.push({route,status:r.status});
}
const unauthenticated=await fetch('http://127.0.0.1:3001/v1/users/example');assert.equal(unauthenticated.status,401);assert.equal((await unauthenticated.json()).error,'API_KEY_REQUIRED');checks.push({route:'/v1/users/example',status:401});
const response=await fetch('http://127.0.0.1:3001/v1/users/example',{headers:{authorization:`Bearer pf_live_${'A'.repeat(49)}`}});assert.equal(response.status,404);assert.equal((await response.json()).error,'NOT_FOUND');checks.push({route:'/v1/users/example',status:404});
await fs.writeFile(new URL('../evidence/local-smoke.json',import.meta.url),JSON.stringify({at:new Date().toISOString(),environment:'local development servers',checks},null,2)+'\n');
console.log(`${checks.length} local HTTP checks passed`);
