import Router from 'koa-router';
import posts from './posts';
import auth from './auth';
import journal from './journal';

const api = new Router();
api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
api.use('/journal', journal.routes());
export default api;
