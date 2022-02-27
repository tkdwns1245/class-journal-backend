import mongoose from 'mongoose';

const { Schema } = mongoose;

const JournalSchema = new Schema({
  schoolName: String,
  gradeNum: Number,
  classroomNum: Number,
  themeColor: String,
  createDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});
JournalSchema.statics.findData = function (schoolname,gradeNum,classroomNum,themeColor) {
  return this.findOne({ schoolname,gradeNum,classroomNum,themeColor });
};

const Journal = mongoose.model('Journal', JournalSchema);
export default Journal;
