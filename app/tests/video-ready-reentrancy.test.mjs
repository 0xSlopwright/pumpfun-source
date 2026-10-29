import test from 'node:test';
import assert from 'node:assert/strict';
import { VideoDraftSession } from '../packages/frontend/src/app/create-video-preview.ts';
test('a ready observer clearing or disposing the draft cannot reattach the released cover', async () => {
  for (const action of ['clear','dispose']) {
    const selected=[];let disposed=0;let session;
    const file=new File(['synthetic'],'video.mp4',{type:'video/mp4'});
    const preview={file,url:'blob:synthetic',covers:[{file:new File(['jpeg'],'cover.jpg',{type:'image/jpeg'}),url:'blob:cover',seconds:1}],dispose(){disposed++;}};
    session=new VideoDraftSession(state=>{if(state.preview)session[action]();},value=>selected.push(value),()=>{},async()=>preview);
    await session.choose(file);
    assert.equal(selected.length,0,action);
    assert.equal(disposed,1,action);
    session.dispose();
  }
});
