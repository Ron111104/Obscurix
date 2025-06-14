// pages/api/updateUser.js
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, newUsername, newPassword, oldPassword } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("auth");
    const users = db.collection("users");

    // Find the user (case-insensitive email search)
    const user = await users.findOne({ 
  email
});
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};

    // Handle username update
    if (newUsername !== undefined) {
      const trimmedUsername = newUsername.trim();
      
      if (!trimmedUsername) {
        return res.status(400).json({ message: "Username cannot be empty" });
      }

      // Check if username is already taken by another user (case-insensitive)
      const existingUser = await users.findOne({ 
        username: { $regex: new RegExp(`^${trimmedUsername}$`, 'i') },
        email: { $not: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }
      });

      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      updateData.username = trimmedUsername;
    }

    // Handle password update
    if (newPassword !== undefined && oldPassword !== undefined) {
      if (!oldPassword.trim()) {
        return res.status(400).json({ message: "Current password is required" });
      }

      // Verify old password
      const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordCorrect) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash the new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      updateData.password = hashedNewPassword;
    }

    // If no valid updates were provided
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid updates provided" });
    }

    // Add timestamp for last update
    updateData.updatedAt = new Date();

    // Update the user
    const result = await users.updateOne(
      { email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    // Fetch updated user data to return
    const updatedUser = await users.findOne({ 
      email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } 
    });

    // Return success response with updated data
    const responseData = {
      message: "User updated successfully",
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        // Add other fields you want to return (but never password)
      }
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Update user error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({ message: "Database error occurred" });
    }
    
    return res.status(500).json({ 
      message: "Internal server error"
    });
  }
}