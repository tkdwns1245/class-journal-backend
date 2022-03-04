import Router from 'koa-router';
import * as memoCtrl from './memo.ctrl';

const memo = new Router();

memo.post('/register', memoCtrl.register);
memo.get('/list', memoCtrl.list);

export default memo;
