// models/Timetable.js
import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entity: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
      },
      time: {
        type: String,
        enum: [
          '8:00', '9:00', '10:00', '11:00', '12:00',
          '1:00', '2:00', '3:00', '4:00', '5:00'
        ],
        required: true,
      },
      subject: { type: String, required: true }
    }
  ]
});

const Timetable= mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);

export default Timetable