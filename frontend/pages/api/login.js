// pages/api/login.js
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("auth");
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      user: {
        userid: user.userid,
        email: user.email,
        username: user.username,
        usertype: user.usertype,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
