import Joi from '@hapi/joi';
import Memo from '../../../models/memo';

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
        journal: selectedJournal
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

export const list = async (ctx) => {
  const { journal_id,selectedMonth } = ctx.params;

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