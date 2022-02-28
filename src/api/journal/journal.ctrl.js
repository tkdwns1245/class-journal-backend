import Joi from '@hapi/joi';
import Journal from '../../models/journal';

export const register = async (ctx) => {
  const schema = Joi.object().keys({
    schoolName: Joi.string().min(3).max(50).required(),
    gradeNum: Joi.number().min(1).max(6).required(),
    classroomNum: Joi.number().required().min(1).max(20),
    themeColor: Joi.string().required(),
    createDate: Joi.date().required()
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { schoolName,gradeNum,classroomNum,themeColor,createDate } = ctx.request.body;
  const { username } = ctx.state.user;

  try {
    const exists = await Journal.findData(schoolName,gradeNum,classroomNum,themeColor,createDate);
    if (exists) { 
      ctx.status = 409;
      return;
    } else {
      const journal = new Journal({
        schoolName,
        gradeNum,
        classroomNum,
        themeColor,
        createDate,
        user: ctx.state.user,
      });
      await journal.save();
      const query = {
        ...(username ? { 'user.username': username } : {})
      };
      const journals = await Journal.find(query)
      .sort({ _id: -1 })
      .exec();
      ctx.body = journals;
    }


  } catch (e) {
    ctx.throw(500, e);
  }
};

export const list = async (ctx) => {
  const { username } = ctx.state.user;

  try {
    const query = {
      ...(username ? { 'user.username': username } : {})
    };
    const journals = await Journal.find(query)
    .sort({ _id: -1 })
    .exec();
    ctx.body = journals;
  } catch (e) {
    ctx.throw(500, e);
  }
};