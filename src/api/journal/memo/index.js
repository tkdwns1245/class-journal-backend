import Router from 'koa-router';
import * as memoCtrl from './memo.ctrl';
import checkLoggedIn from '../../../lib/checkLoggedIn';

const memos = new Router();
memos.get('/',checkLoggedIn, memoCtrl.list);
memos.post('/',checkLoggedIn, memoCtrl.register);

const memo = new Router();
memo.patch('/',checkLoggedIn,memoCtrl.checkOwnMemo, memoCtrl.update);
memo.delete('/',checkLoggedIn,memoCtrl.checkOwnMemo, memoCtrl.remove);

memos.use('/:id',memoCtrl.getMemoById, memo.routes());

export default memos;
