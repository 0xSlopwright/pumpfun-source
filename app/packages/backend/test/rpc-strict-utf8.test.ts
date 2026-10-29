import test,{mock} from 'node:test';import assert from 'node:assert/strict';
import dns from 'node:dns/promises';import https from 'node:https';import {EventEmitter} from 'node:events';import {createRequire} from 'node:module';
const {createPinnedRpcCall,PortfolioRpcError}=createRequire(import.meta.url)('../../frontend/src/app/portfolio/rpc.ts');
async function callWithBody(body:Buffer){
  const lookup=mock.method(dns,'lookup',(async()=>[{address:'8.8.8.8',family:4}]) as any);
  const request=mock.method(https,'request',((...args:any[])=>{
    const callback=args[2];const req=new EventEmitter() as any;
    req.end=()=>queueMicrotask(()=>{const response=new EventEmitter() as any;response.headers={};response.statusCode=200;callback(response);response.emit('data',body);response.emit('end');});
    req.destroy=(error:Error)=>req.emit('error',error);return req;
  }) as any);
  try {const {call}=await createPinnedRpcCall('https://rpc.example.invalid',1000);return await call('synthetic',[]);}
  finally{request.mock.restore();lookup.mock.restore();}
}
const invalid=(error:unknown)=>error instanceof PortfolioRpcError&&(error as any).code==='RPC_RESPONSE_INVALID';
test('pinned RPC transport rejects malformed UTF-8 inside otherwise valid JSON',async()=>{
  await assert.rejects(callWithBody(Buffer.concat([Buffer.from('{"jsonrpc":"2.0","id":1,"result":"'),Buffer.from([255]),Buffer.from('"}')])),invalid);
});
test('pinned RPC transport keeps a leading UTF-8 BOM so it is not silently stripped before JSON parsing',async()=>{
  assert.equal(await callWithBody(Buffer.from('{"jsonrpc":"2.0","id":1,"result":"ok"}')),'ok');
  await assert.rejects(callWithBody(Buffer.concat([Buffer.from([0xef,0xbb,0xbf]),Buffer.from('{"jsonrpc":"2.0","id":1,"result":"ok"}')])),invalid);
});
