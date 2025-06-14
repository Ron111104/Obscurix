"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const dummyNews = [
  "New zero-day vulnerability found in XServer.",
  "AI firewall blocks 99.9% of intrusions.",
  "Security update available for Android 13.",
  "New encryption algorithm promises 5x speed.",
  "Phishing attacks rise 40% in 2025.",
  "Critical bug in biometric access software.",
];

const stats = [
  { number: "120K+", label: "Developers Secured" },
  { number: "750+", label: "Companies Using" },
  { number: "99.5%", label: "Threat Reduction" },
];

export default function News() {
  return (
    <section className="bg-[#0a0a0a] text-white py-24 px-6 font-geist">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: News Feed */}
        <div className="border border-[#333] bg-[#141414] rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-[#7e30e1] to-[#b364ff] text-white px-6 py-3 font-semibold rounded-t-2xl">
            📰 Security Headlines
          </div>
          <div className="h-[400px] px-6 py-4 overflow-hidden group">
            <div className="flex flex-col animation-scroll-news space-y-3">
              {dummyNews.map((news, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-base sm:text-lg text-[#d1d1d1] py-2 border-b border-[#2d2d2d] hover:no-underline"
                >
                  {news}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by the Developer Community
          </h2>
          <p className="text-[#bcbcbc] text-lg">
            Obscurix empowers dev teams to share code safely, enabling innovation without risking sensitive information.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-xl p-6 text-center shadow-md">
                <h3 className="text-3xl sm:text-4xl font-bold text-[#b364ff]">{stat.number}</h3>
                <p className="text-[#ccc] mt-2 text-sm sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scrollY {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        .animation-scroll-news {
          animation: scrollY 25s linear infinite;
        }

        .group:hover .animation-scroll-news {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
