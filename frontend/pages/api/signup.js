// pages/api/signup.js
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password, username, usertype } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("auth");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      userid: crypto.randomUUID(),
      email,
      username,
      password: hashedPassword,
      usertype,
    };

    await users.insertOne(newUser);

    return res.status(200).json({
      user: {
        userid: newUser.userid,
        email,
        username,
        usertype,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
