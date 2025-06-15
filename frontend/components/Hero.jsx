"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import StarsBG from "./StarsBG";

export default function Hero() {
  const scrollToNews = () => {
    const newsSection = document.getElementById("news");
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
  id="hero"
  className="relative bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center px-6 pt-32 md:pt-20 overflow-hidden font-geist">
      <StarsBG />

      {/* Full-width glow */}
      <div className="absolute bottom-0 left-0 w-full h-60 bg-gradient-to-t from-[#7e30e1]/40 to-transparent blur-2xl z-0" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-4xl sm:text-6xl font-bold leading-tight text-white drop-shadow-xl"
        >
          Cognitive Code Obfuscation with{" "}
          <span className="bg-gradient-to-r from-[#7e30e1] to-[#b364ff] bg-clip-text text-transparent">
            GenAI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#bcbcbc] text-lg sm:text-xl leading-relaxed mt-6"
        >
          Obscurix helps developers safely share code by automatically anonymizing
          personal details, credentials, and proprietary logic. Our GenAI rewrites
          sensitive code into functional, context-free pseudocode—complete with logic
          explanations. With built-in Data Sensitivity Scoring, developers can assess
          exposure risks before going public.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <Link href="/redactify">
    <button className="px-6 py-3 bg-[#7e30e1] text-white rounded-xl shadow-lg hover:bg-[#9e51ff] transition-all duration-300">
      Try it Now
    </button>
  </Link>
          <button
            onClick={scrollToNews}
            className="px-6 py-3 border border-[#7e30e1] text-[#7e30e1] rounded-xl hover:bg-[#1a1a1a] transition-all duration-300"
          >
            Learn More
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
