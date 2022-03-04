import mongoose from 'mongoose';

const { Schema } = mongoose;

const MemoSchema = new Schema({
  title: String,
  content: String,
  memoMonth: Number,
  createDate: {
    type: Date,
    default: Date.now,
  },
  journal: {
    _id: mongoose.Types.ObjectId,
  }
});

const Memo = mongoose.model('Memo', MemoSchema);
export default Memo;
