import mongoose, { Document, Schema } from 'mongoose';

interface AttendanceDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  status: string; // 'present', 'absent', etc.
  date: Date; // Date when the attendance was recorded
  time: string; // Exact time when the attendance was marked (ISO string)
}

const AttendanceSchema = new Schema<AttendanceDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true }, // 'present', 'absent', etc.
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Store time as ISO string
});

export default mongoose.models.Attendance || mongoose.model<AttendanceDocument>('Attendance', AttendanceSchema);