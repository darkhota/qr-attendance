import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import Attendance from "../../models/Attendance";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;

  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ isNewUser: true }); // Indicate that the user is new
    }

    // Check if attendance already exists for today
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    const existingAttendance = await Attendance.findOne({
      userId: user._id, // Ensure the correct field name is used: `userId`
      date: { $gte: new Date(today + "T00:00:00.000Z"), $lt: new Date(today + "T23:59:59.999Z") }, // Check for today's date range
    });

    if (existingAttendance) {
      return res.status(200).json({ message: "Attendance already marked for today." });
    }

    // Create a new attendance record for today with all required fields
    const attendance = new Attendance({
      userId: user._id, // Correct field name: userId
      date: new Date(), // Store the current date and time
      time: new Date().toISOString(), // Store the current time as ISO string
      status: "present", // Default status for check-in
    });
    
    await attendance.save();

    // Populate the user's firstName and lastName in the response
    const populatedAttendance = await Attendance.findById(attendance._id).populate('userId', 'firstName lastName');

    res.status(200).json({ 
      message: "Check-in successful!", 
      isNewUser: false,
      attendance: populatedAttendance, // Include populated user fields
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
}