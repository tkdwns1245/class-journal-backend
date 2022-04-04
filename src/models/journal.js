import mongoose from 'mongoose';

const { Schema } = mongoose;

const JournalSchema = new Schema({
  schoolName: String,
  gradeNum: Number,
  classroomNum: Number,
  themeColor: String,
  classYear: Date,
  createDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});
JournalSchema.statics.findData = function (schoolName,gradeNum,classroomNum,themeColor,createDate) {
  return this.findOne({ schoolName,gradeNum,classroomNum,themeColor,createDate });
};

const Journal = mongoose.model('Journal', JournalSchema);
export default Journal;
