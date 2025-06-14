"use client";

import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Usb,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [userStats, setUserStats] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [viewMode, setViewMode] = useState("activity");
  const canvasRef = useRef(null);

  const getStatusIcon = (status) =>
    status ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const letters = "アァイィウヴエエェオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモラリルレロワン";
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
    setUserStats([
      {
        username: "Faiz Abid",
        attempts: 5,
        warnedAttempts: 2,
        score: 87,
        flagged: false,
        timestamp: new Date().toISOString(),
      },
      {
        username: "Syed Omar",
        attempts: 10,
        warnedAttempts: 5,
        score: 62,
        flagged: true,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
          className="min-h-screen text-white px-6 py-20 font-geist"
        >
          <h1 className="text-4xl font-bold text-center text-[#a855f7] mb-10 mt-4 font-pg drop-shadow">
            Admin Dashboard
          </h1>
          <div className="space-y-6">
            {userStats.map((user, idx) => (
              <div key={idx} className="rounded-lg border border-[#3b3b3b] bg-[#1a1a1a]">
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex justify-between items-center px-6 py-4"
                >
                  <div>
                    <p className="text-lg font-bold font-pg">{user.username}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(user.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(user.flagged)} Flagged
                    </div>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        user.score >= 75
                          ? "bg-green-600"
                          : user.score >= 50
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      Score: {user.score}
                    </span>
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
                      className="px-6 py-4 bg-[#0f0f0f] text-sm text-gray-300"
                    >
                      <p>Attempts: {user.attempts}</p>
                      <p>Warned Attempts: {user.warnedAttempts}</p>
                      <p>Score: {user.score}</p>
                      <p>Flagged: {user.flagged ? "Yes" : "No"}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.main>
      </div>
    </>
  );
}