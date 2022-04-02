import mongoose from 'mongoose';

const { Schema } = mongoose;

const AppointmentSchema = new Schema({
  title: String,
  content: String,
  createDate: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  journal: {
    _id: mongoose.Types.ObjectId,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
