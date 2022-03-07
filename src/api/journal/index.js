import Router from 'koa-router';
import * as journalCtrl from './journal.ctrl';

const jounal = new Router();

jounal.post('/register', journalCtrl.register);
jounal.get('/list', journalCtrl.list);

export default jounal;
