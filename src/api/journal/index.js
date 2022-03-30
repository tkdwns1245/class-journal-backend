import Router from 'koa-router';
import * as journalCtrl from './journal.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const jounal = new Router();

jounal.post('/',checkLoggedIn, journalCtrl.register);
jounal.get('/',checkLoggedIn, journalCtrl.list);

export default jounal;
