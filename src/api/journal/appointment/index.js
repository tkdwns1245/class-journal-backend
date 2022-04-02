import Router from 'koa-router';
import * as appointmentCtrl from './appointment.ctrl';
import checkLoggedIn from '../../../lib/checkLoggedIn';

const appointments = new Router();
appointments.get('/',checkLoggedIn, appointmentCtrl.list);
appointments.post('/',checkLoggedIn, appointmentCtrl.register);

const appointment = new Router();
appointment.patch('/',checkLoggedIn,appointmentCtrl.checkOwnAppointment, appointmentCtrl.update);
appointment.delete('/',checkLoggedIn,appointmentCtrl.checkOwnAppointment, appointmentCtrl.remove);

appointments.use('/:id',appointmentCtrl.getAppointmentById, appointment.routes());

export default appointments;
