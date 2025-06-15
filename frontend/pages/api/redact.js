// pages/api/redact.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const backendUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
      : process.env.NEXT_PUBLIC_BACKEND_URL_PROD;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { text, mode, email } = req.body;

    // 1. Call backend to get redacted data
    const response = await fetch(`${backendUrl}/api/redact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ message: errText });
    }

    const { type, outputs, result, metrics } = await response.json();

    // 2. Store/Update metrics per email
    if (email && metrics) {
      const client = await clientPromise;
      const db = client.db("data");
      const collection = db.collection("metrics");

      // Build $inc object for MongoDB
      const incrementFields = {};
      for (const [key, value] of Object.entries(metrics)) {
        incrementFields[`metrics.${key}`] = value;
      }

      // Always increment totalAttempts
      incrementFields["totalAttempts"] = 1;

      // Check if all metrics are zero → increment warningAttempts
      const totalMetricSum = Object.values(metrics).reduce((sum, val) => sum + val, 0);
      if (totalMetricSum != 0) {
        incrementFields["warningAttempts"] = 1;
      }

      // Update DB
      await collection.updateOne(
        { email },
        {
          $setOnInsert: { email },
          $inc: incrementFields,
        },
        { upsert: true }
      );
    }

    // 3. Return response
    return res.status(200).json({
      type,
      ...(type === "code" ? { result } : { outputs }),
      metrics,
    });
  } catch (error) {
    console.error("API Redact Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
