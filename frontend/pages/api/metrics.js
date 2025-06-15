import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("data");
    const collection = db.collection("metrics");

    const users = await collection.find({}).toArray();

    const formattedUsers = users.map((user) => ({
      email: user.email,
      metrics: user.metrics ?? {},
        totalAttempts: user.totalAttempts ?? 0,
        warningAttempts: user.warningAttempts ?? 0,
      timestamp: user.timestamp ?? new Date().toISOString(),
    }));

    return res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
