// models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  date: { type: Date, required: true, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
