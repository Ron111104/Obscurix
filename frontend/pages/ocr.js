import { useState } from "react";
import axios from "axios";
import Link from "next/link";
// Reuse animated background from login
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

export default function OCRPage() {
  const [image, setImage] = useState(null);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
      : process.env.NEXT_PUBLIC_BACKEND_URL_PROD;

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setTexts([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/ocr/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTexts(res.data.texts || []);
    } catch (err) {
      alert("OCR failed: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 relative overflow-hidden">
      <AnimatedStars />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
  <div className="text-2xl font-bold text-purple-400">
    <Link href="/">
      Obscurix
    </Link>{' '}
    OCR
  </div>
</nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-xl">
          <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h1 className="text-3xl font-bold text-white text-center mb-6">Extract Text from Image</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all"
                required
              />

              <button
                type="submit"
                disabled={!image || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Run OCR"
                )}
              </button>
            </form>

            {texts.length > 0 && (
              <div className="mt-6">
                <h2 className="text-white text-xl font-semibold mb-3">Detected Text:</h2>
                <ul className="text-white/80 list-disc list-inside space-y-1">
                  {texts.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-center mt-8 text-white/60 text-sm">
            Powered by <span className="text-purple-400">EasyOCR</span> and <span className="text-purple-400">Obscurix GenAI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
