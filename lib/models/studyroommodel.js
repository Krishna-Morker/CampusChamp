// models/StudyRoom.js
import mongoose from 'mongoose';

const StudyRoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  roomDescription: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

const StudyRoom = mongoose.models.StudyRoom || mongoose.model('StudyRoom', StudyRoomSchema);

export default StudyRoom;
