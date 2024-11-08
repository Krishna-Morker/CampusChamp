import mongoose from 'mongoose';

const TimerSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Timer= mongoose.models.Timer || mongoose.model('Timer', TimerSchema);

export default Timer