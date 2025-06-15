import { useState } from "react";
import Link from "next/link";

// Animated stars component
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

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    usertype: "user",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data in localStorage after successful signup
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 relative overflow-hidden">
      {/* Animated background stars */}
      <AnimatedStars />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold">
          <Link href="/">
            <span className="text-purple-400 text-3xl cursor-pointer">
              Obscurix
            </span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-96px)] px-4">
        <div className="w-full max-w-sm">
          <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-semibold text-white mb-2">
                Join Obscurix
              </h1>
              <p className="text-white/70 text-base">
                Start obfuscating code securely
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <select
                value={form.usertype}
                onChange={(e) => setForm({ ...form, usertype: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="user" className="bg-gray-800 text-white">
                  User
                </option>
                <option value="admin" className="bg-gray-800 text-white">
                  Admin
                </option>
              </select>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <p className="mt-6 text-center text-white/60 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition"
              >
                Sign In
              </a>
            </p>

            <p className="mt-4 text-center text-white/40 text-xs">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>
            </p>
          </div>

          <p className="text-white/60 text-center text-xs mt-6">
            Powered by <span className="text-purple-400">GenAI</span>
          </p>
        </div>
      </div>
    </div>
  );
}