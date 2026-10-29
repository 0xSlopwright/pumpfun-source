import test from 'node:test';
import assert from 'node:assert/strict';
import {lockBodyScroll} from '../packages/frontend/src/lib/body-scroll-lock.ts';
function body(value,priority='') {
  const style={get overflow(){return value;},set overflow(next){value=next;priority='';},getPropertyPriority(){return priority;},setProperty(_name,next,nextPriority=''){value=next;priority=nextPriority;}};
  return {style};
}
test('scroll owners preserve important priority and independently restore replacement bodies',()=>{
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'document');
  const first=body('clip','important'),second=body('scroll');let releaseA=()=>{},releaseB=()=>{},releaseC=()=>{};
  Object.defineProperty(globalThis,'document',{value:{body:first},writable:true,configurable:true});
  try {
    releaseA=lockBodyScroll();releaseB=lockBodyScroll();releaseA();releaseA();
    assert.equal(first.style.overflow,'hidden');
    globalThis.document.body=second;releaseC=lockBodyScroll();releaseB();
    assert.equal(first.style.overflow,'clip');assert.equal(first.style.getPropertyPriority('overflow'),'important');
    assert.equal(second.style.overflow,'hidden');releaseC();assert.equal(second.style.overflow,'scroll');
  } finally {releaseA();releaseB();releaseC();if(descriptor)Object.defineProperty(globalThis,'document',descriptor);else delete globalThis.document;}
});
