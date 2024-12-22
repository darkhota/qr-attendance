import dbConnect from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      await dbConnect();
      const user = await User.findOne({ email });
      if (user) {
        return res.status(200).json({ exists: true });
      }
      return res.status(200).json({ exists: false });
    } catch (error) {
      return res.status(500).json({ error: "Failed to check user" });
    }
  }
  res.status(405).json({ error: "Method not allowed" });
}