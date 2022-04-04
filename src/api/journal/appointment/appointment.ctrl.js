import Joi from '@hapi/joi';
import Appointment from '../../../models/appointment';
import { ObjectId } from 'bson';

export const register = async (ctx) => {
  console.log(ctx.request.body);
  const schema = Joi.object().keys({
    title: Joi.string().min(0).max(30).required(),
    content: Joi.string().min(0).max(100).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    selectedJournal: Joi.required()
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title,content,startDate,endDate,selectedJournal } = ctx.request.body;

  try {
      const appointment = new Appointment({
        title,
        content,
        startDate:new Date(startDate),
        endDate:new Date(endDate),
        journal: selectedJournal,
        user: ctx.state.user,
      });
      await appointment.save();
      const query = {
        ...({ 'journal._id': selectedJournal._id,
        'startDate':  {
          $gte: new Date(startDate.split('-')[0],startDate.split('-')[1]),
          $lt: new Date(startDate.split('-')[0],startDate.split('-')[1]+1)
        }})
      };
      const appointments = await Appointment.find(query)
      .sort({ _id: -1 })
      .exec();
      ctx.body = appointments;
    } catch (e) {
      ctx.throw(500, e);
    }
};

export const update = async (ctx) => {
  const {id} = ctx.params;
  try{
    const appointment = await Appointment.findByIdAndUpdate(id,ctx.request.body, {
      new: true,
    }).exec();
    if(!appointment){
      ctx.status = 404;
      return;
    }
    ctx.body = appointment;
  } catch(e) {
    ctx.throw(500, e );
  }

};

export const remove = async ctx => {
  const {id} = ctx.params;
  try{
    await Appointment.findByIdAndRemove(id).exec();
    ctx.body= {id};
  } catch(e) {
    ctx.throw(500,e);
  }
}

export const list = async (ctx) => {
  let { journal_id,journal_classYear,selectedMonth } = ctx.query;
  if(selectedMonth == null){
    selectedMonth = new Date().getMonth()+1;
  }
  try {
    const query = {
      ...({ 'journal._id': journal_id,
      'startDate':  {
        $gte: new Date(journal_classYear.split('-')[0],selectedMonth),
        $lt: new Date(journal_classYear.split('-')[0],selectedMonth+1)
      }})
    };
    const appointments = await Appointment.find(query)
    .sort({ _id: -1 })
    .exec();
    ctx.body = appointments;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getAppointmentById = async (ctx, next) => {
  const { id } = ctx.params;
  if(!ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {
      Message: 'Not valid ObjectId',
    }
    return;
  }
  try{
    const appointment = await Appointment.findById(id);
    if(!appointment){
      ctx.status = 404;
      return;
    }
    ctx.state.appointment = appointment;
    return next();
  }catch(e) {
    ctx.throw(500, e);
  }
}

export const checkOwnAppointment = (ctx, next) => {
  const {user,appointment} = ctx.state;
  if(appointment.user._id.toString() !== user._id) {
    ctx.status = 403;
    ctx.body = {
      Message: 'do not have authority',
    }
    return;
  }
  return next();
}