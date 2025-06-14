import { useState } from "react";

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

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data in memory instead of localStorage/sessionStorage
        window.location.href = "/";
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 relative overflow-hidden">
      {/* Animated background stars */}
      <AnimatedStars />
      
      {/* Navigation bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold">
          <span className="text-purple-400">Obscurix</span>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-md">
          {/* Login container */}
          <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome Back
              </h1>
              <p className="text-white/70 text-lg">
                Sign in to access your secure workspace
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/60">
                Don't have an account?{" "}
                <a href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  Create Account
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-white/50 hover:text-white/70 text-sm transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Additional info */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              Secure login powered by <span className="text-purple-400">GenAI</span> obfuscation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}