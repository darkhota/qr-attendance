import dbConnect from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
        console.log("registering..")

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { firstName, lastName, dob, address, phone, firstTimer, email } = req.body;

  try {
    await dbConnect();
        console.log("connected..")


    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
        console.log("creating new..")


    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      dob,
      address,
      phone,
      firstTimer: firstTimer === "yes",
      email,
      qrCodeCheckedIn: true, // Automatically check them in
    });
    console.log("creating..")

    res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
}