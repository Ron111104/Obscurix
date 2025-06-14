import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Animated stars background (reuse)
const AnimatedStars = () => {
  const stars = Array.from({ length: 600 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    animationDelay: Math.random() * 2,
    animationDuration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-60 animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [changePass, setChangePass] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);
    setNewUsername(parsed.username || "");
  }, []);

  const updateUserInDatabase = async (updateData) => {
    try {
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          ...updateData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      return { success: true, data };
    } catch (error) {
      console.error("Database update error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) return;

    setIsLoading(true);
    
    try {
      // Update database first
      const result = await updateUserInDatabase({ newUsername });
      
      if (result.success) {
        // Only update localStorage if database update was successful
        const updated = { ...user, username: newUsername };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setIsEditing(false);
        alert("Username updated successfully!");
      } else {
        alert(`Failed to update username: ${result.error}`);
        // Reset to original username on failure
        setNewUsername(user.username);
      }
    } catch (error) {
      alert("Network error. Please try again.");
      setNewUsername(user.username);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPassError("");
    setPassLoading(true);

    if (!oldPass || !newPass) {
      setPassError("Both fields are required.");
      setPassLoading(false);
      return;
    }

    if (newPass.length < 6) {
      setPassError("New password must be at least 6 characters long.");
      setPassLoading(false);
      return;
    }

    try {
      // Update database first
      const result = await updateUserInDatabase({ 
        newPassword: newPass, 
        oldPassword: oldPass 
      });
      
      if (result.success) {
        // Only update localStorage if database update was successful
        const updated = { ...user, password: newPass };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setChangePass(false);
        setOldPass("");
        setNewPass("");
        alert("Password changed successfully!");
      } else {
        setPassError(result.error);
      }
    } catch (error) {
      setPassError("Network error. Please try again.");
    } finally {
      setPassLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 relative overflow-hidden">
      <AnimatedStars />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <button
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-purple-400 hover:scale-105 transition"
        >
          Obscurix
        </button>
      </nav>

      {/* Main Profile Card */}
      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-lg bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
          <h1 className="text-4xl font-bold text-center text-white">Your Profile</h1>

          {/* Username (editable) */}
          {Object.entries(user).map(([key, value]) => {
            if (key === "username" && isEditing) {
              return (
                <div key={key}>
                  <label className="text-white/60 text-sm capitalize">{key}</label>
                  <input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
                  />
                </div>
              );
            }

            if (key === "password") return null; // Don't show password field

            return (
              <div key={key}>
                <label className="text-white/60 text-sm capitalize">{key}</label>
                <p className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white">
                  {value}
                </p>
              </div>
            );
          })}

          {/* Buttons */}
          <div className="flex justify-between flex-wrap gap-3 pt-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewUsername(user.username);
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUsername}
                  disabled={isLoading || !newUsername.trim()}
                  className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-lg shadow transition disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Username"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-lg shadow transition"
              >
                Edit Username
              </button>
            )}

            <button
              onClick={() => setChangePass(!changePass)}
              disabled={isLoading || passLoading}
              className="w-full px-4 py-2 mt-2 text-white bg-purple-700/80 hover:bg-purple-600/90 rounded-lg transition disabled:opacity-50"
            >
              {changePass ? "Cancel Password Change" : "Change Password"}
            </button>
          </div>

          {/* Password Change Section */}
          {changePass && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-white/60 text-sm">Old Password</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  disabled={passLoading}
                  className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  disabled={passLoading}
                  className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
                />
              </div>

              {passError && (
                <p className="text-red-400 text-sm">{passError}</p>
              )}

              <button
                onClick={handlePasswordChange}
                disabled={passLoading || !oldPass || !newPass}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50"
              >
                {passLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-white/60 text-sm pt-6">
            Obscurix Secured by <span className="text-purple-400">GenAI</span>
          </p>
        </div>
      </div>
    </div>
  );
}