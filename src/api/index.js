import Router from 'koa-router';
import posts from './posts';
import auth from './auth';
import journal from './journal';
import memos from './journal/memo';
import appointments from './journal/appointment';

const api = new Router();
api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
api.use('/journal', journal.routes());
api.use('/journal/memo', memos.routes());
api.use('/journal/appointment', appointments.routes());
export default api;
