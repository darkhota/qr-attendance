import { NextApiRequest, NextApiResponse } from "next";

const userDB: Record<string, { name: string; phone: string }> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, name, phone } = req.body;

  if (req.method === "POST") {
    if (!email || !name || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    userDB[email] = { name, phone };
    return res.status(201).end();
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}