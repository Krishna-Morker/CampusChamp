// models/Attendance.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    message: String,
    readStatus: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });
  

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;
