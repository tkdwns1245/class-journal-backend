import Joi from '@hapi/joi';
import Memo from '../../../models/memo';
import { ObjectId } from 'bson';

export const register = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().min(0).max(30).required(),
    content: Joi.string().min(0).max(100).required(),
    selectedMonth: Joi.number().required(),
    selectedJournal: Joi.required()
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title,content,selectedMonth,selectedJournal } = ctx.request.body;

  try {
      const memo = new Memo({
        title,
        content,
        memoMonth:selectedMonth,
        journal: selectedJournal,
        user: ctx.state.user,
      });
      await memo.save();
      const query = {
        ...({ 'journal._id': selectedJournal._id,'memoMonth':selectedMonth })
      };
      const memos = await Memo.find(query)
      .sort({ _id: -1 })
      .exec();
      ctx.body = memos;
    } catch (e) {
      ctx.throw(500, e);
    }
};

export const update = async (ctx) => {
  const {id} = ctx.params;
  try{
    const memo = await Memo.findByIdAndUpdate(id,ctx.request.body, {
      new: true,
    }).exec();
    if(!memo){
      ctx.status = 404;
      return;
    }
    ctx.body = memo;
  } catch(e) {
    ctx.throw(500, e );
  }

};

export const remove = async ctx => {
  const {id} = ctx.params;
  try{
    await Memo.findByIdAndRemove(id).exec();
    ctx.body= {id};
  } catch(e) {
    ctx.throw(500,e);
  }
}

export const list = async (ctx) => {
  let { journal_id,selectedMonth } = ctx.query;
  if(selectedMonth == null){
    selectedMonth = new Date().getMonth()+1;
  }
  try {
    const query = {
      ...({ 'journal._id': journal_id,'memoMonth':selectedMonth })
    };
    const memos = await Memo.find(query)
    .sort({ _id: -1 })
    .exec();
    ctx.body = memos;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getMemoById = async (ctx, next) => {
  const { id } = ctx.params;
  if(!ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {
      Message: 'Not valid ObjectId',
    }
    return;
  }
  try{
    const memo = await Memo.findById(id);
    if(!memo){
      ctx.status = 404;
      return;
    }
    ctx.state.memo = memo;
    return next();
  }catch(e) {
    ctx.throw(500, e);
  }
}

export const checkOwnMemo = (ctx, next) => {
  const {user,memo} = ctx.state;
  if(memo.user._id.toString() !== user._id) {
    ctx.status = 403;
    ctx.body = {
      Message: 'do not have authority',
    }
    return;
  }
  return next();
}