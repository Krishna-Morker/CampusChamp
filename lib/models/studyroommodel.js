// models/StudyRoom.js
import mongoose from 'mongoose';

const StudyRoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  roomDescription: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    username: { type: String, required: true },
    roomId:{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyRoom' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  uploads: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      filename: { type: String, required: true },
      fileUrl: { type: String, required: true },
      submissionDate: { type: Date, default: Date.now }
    }
  ],
  tasks: [
    {
      title: { type: String, required: true },
      description: { 
        type: String, 
        required: true 
      },
      fileUrl: { type: String, required: true },
      submissionDate: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const StudyRoom = mongoose.models.StudyRoom || mongoose.model('StudyRoom', StudyRoomSchema);

export default StudyRoom;
