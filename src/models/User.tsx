import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  firstTimer: { type: Boolean, required: true },
  email: { type: String, unique: true, required: true },
  qrCodeCheckedIn: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);