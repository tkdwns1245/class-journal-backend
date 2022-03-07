import Router from 'koa-router';
import * as memoCtrl from './memo.ctrl';

const memo = new Router();

memo.post('/register', memoCtrl.register);
memo.patch('/:id', memoCtrl.update);
memo.delete('/:id', memoCtrl.remove);
memo.get('/list', memoCtrl.list);

export default memo;
