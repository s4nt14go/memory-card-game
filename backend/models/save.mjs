import mongoose from 'mongoose';

export const possibleDifficulties  = ['Easy', 'Normal', 'Hard'];
const saveSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  gameDate: { type: Date, required: true, default: Date.now },
  failed: { type: Number, required: true },
  difficulty: {
    type: String,
    required: true,
    enum: possibleDifficulties,
  },
  completed: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
});

export default mongoose.model('Save', saveSchema);
