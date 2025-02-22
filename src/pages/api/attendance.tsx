import { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from '../../utils/dbConnect';
import Attendance from '../../models/Attendance';

interface AttendanceRequest extends NextApiRequest {
  body: {
    userId: string;
    status: string; // 'present', 'absent', etc.
  };
}

export default async function handler(req: AttendanceRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { userId, status } = req.body;

    try {
      const newAttendance = new Attendance({
        userId,
        status,
        date: new Date(), // Store current date
        time: new Date().toISOString(), // Store exact time of the attendance
      });

      await newAttendance.save();
      return res.status(201).json({ message: 'Attendance recorded successfully.' });
    } catch (error) {
      console.error("Error recording attendance:", error); // Log the error
      return res.status(500).json({ error: 'Failed to record attendance' });
    }
  }

  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const attendance = await Attendance.find({ userId }).sort({ date: -1 });
      return res.status(200).json(attendance);
    } catch (error) {
      console.error("Error fetching attendance records:", error); // Log the error
      return res.status(500).json({ error: 'Failed to fetch attendance records.' });
    }
  }
}