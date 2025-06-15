"use client";

import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  UserCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [userStats, setUserStats] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const letters = "アァイィウヴエエェオカキクケコサシスセソタチツテトナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#a270d1";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height || Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        setUserStats(data.users);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchStats();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const getStatusBadge = (flagged) =>
    flagged ? (
      <span className="flex items-center gap-1 text-sm font-semibold px-2 py-1 bg-red-600/20 text-red-400 rounded-full">
        <XCircle className="w-4 h-4" /> Flagged
      </span>
    ) : (
      <span className="flex items-center gap-1 text-sm font-semibold px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
        <CheckCircle className="w-4 h-4" /> Safe
      </span>
    );

  const getScoreBadge = (score) => {
    let bg, text;
    if (score >= 75) {
      bg = "bg-green-700/30";
      text = "text-green-300";
    } else if (score >= 50) {
      bg = "bg-yellow-700/30";
      text = "text-yellow-300";
    } else {
      bg = "bg-red-700/30";
      text = "text-red-300";
    }
    return (
      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${bg} ${text}`}>
        Score: {score}
      </span>
    );
  };

  const calculatePrivacyScore = (metrics) => {
    const weights = {
      api_keys: 3,
      bank_accounts: 1.5,
      card_numbers: 1.5,
      passwords: 1,
      pins: 1,
      emails: 0.5,
      phone_numbers: 0.5,
      profane: 0.5,
    };

    let rawScore = 0;
    for (const key in weights) {
      const val = metrics[key] || 0;
      rawScore += val * weights[key];
    }

    const normalized = Math.max(0, 100 - Math.min(rawScore, 100));
    return Math.round(normalized);
  };

  return (
    <>
      <Navbar />
      <div className="relative">
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />

        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen px-6 py-20 text-white font-geist relative z-10"
        >
          <h1 className="text-4xl font-bold text-center text-[#a855f7] mb-12 font-pg drop-shadow">
            Admin Dashboard
          </h1>

          <div className="flex flex-col gap-6">
            {userStats.map((user, idx) => {
              const metrics = user.metrics || {};
              const warnedAttempts = user.warningAttempts ?? 0;
              const totalAttempts = user.totalAttempts ?? 0;
              const score = calculatePrivacyScore(metrics);
              const flagged = score < 50;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#2c2c2c] bg-[#181818] hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex justify-between items-center px-6 py-5"
                  >
                    <div className="flex items-center gap-4">
                      <UserCircle className="w-9 h-9 text-[#b183f5]" />
                      <div>
                        <p className="text-lg font-semibold">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(user.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(flagged)}
                      {getScoreBadge(score)}
                      {openIndex === idx ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-5 text-sm text-gray-300 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-[#262626] px-4 py-3 rounded-lg">
                            <p className="text-xs text-gray-400">Total Attempts</p>
                            <p className="text-lg font-bold">{totalAttempts}</p>
                          </div>
                          <div className="bg-[#262626] px-4 py-3 rounded-lg">
                            <p className="text-xs text-gray-400">Warned Attempts</p>
                            <p className="text-lg font-bold text-yellow-300">
                              {warnedAttempts}
                            </p>
                          </div>
                          <div className="bg-[#262626] px-4 py-3 rounded-lg">
                            <p className="text-xs text-gray-400">Score</p>
                            <p className="text-lg font-bold">{score}</p>
                          </div>
                          <div className="bg-[#262626] px-4 py-3 rounded-lg">
                            <p className="text-xs text-gray-400">Flagged</p>
                            <p className="text-lg font-bold">
                              {flagged ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.main>
      </div>
    </>
  );
}
