"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const stats = [
  { number: "1.35B+", label: "Individuals Affected by Data Compromises (2024, U.S.)" },
  { number: "3,158", label: "Data Breach Incidents in the U.S. (2024)" },
  { number: "30,000+", label: "Leaking APIs Found on Postman (2024)" },
];

const dummyNews = [
  "Coinbase Breach - 70,000 Users Affected\n Coinbase revealed that overseas support agents were bribed to leak customer data, including SSNs and bank details. Losses are estimated at $180-$400M. The company refused a $20M ransom.",
  "Marks & Spencer - $400M Cyberattack\n M&S faced a targeted cyberattack in May 2025, halting online operations and causing stock outages. Estimated losses: $403M.",
  "AT&T - 86 Million Customers Breached\n Hackers exposed personal data of 86M AT&T customers, including 44M SSNs. Data was leaked on the dark web, raising identity theft concerns.",
  "Coca-Cola - 23 Million Records Exposed\n Two ransomware attacks hit Coca-Cola, leaking HR and customer data. The Everest gang published records after a rejected $20M ransom.",
  "Yale New Haven Health - 5.5M Patients Exposed\n Connecticut's largest healthcare provider reported a March breach that compromised medical and personal data of 5.5M patients.",
  "Healthcare Breaches Surge - 20M+ Affected\n By April 2025, 238 healthcare breaches impacted over 20M people. Ransomware and network server attacks remain dominant.",
  "Credential Leak - 184M Logins from Tech Giants\n A public database exposed 184M login credentials from major platforms like Google, Apple, and Facebook, likely via malware.",
  "Data Breach Costs Hit $4.88M Average\n The average cost of a breach rose to $4.88M in 2025. Nearly half involved customer PII, with breaches taking 277 days to detect and contain.",
  "Retail Cyberattacks Rise - Dior, Adidas, More Hit\n In 2025, major retail brands were attacked, with third-party vendors causing 41% of ransomware cases. Breach rates hit 52.4%.",
  "AI Tools and Data Leaks - 84% Breached\n Rapid AI adoption has led to security gaps, with 84% of tools exposed. Sensitive prompts are often entered via personal accounts.",
];

export default function News() {
  const newsRef = useRef(null);
  const isInView = useInView(newsRef, { once: true });

  return (
    <section
      id="news"
      className="relative bg-[#0a0a0a] py-24 px-4 sm:px-6 text-white font-geist"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left: News Feed */}
        <div
          className="border border-[#333] bg-[#141414] rounded-2xl overflow-hidden shadow-xl -translate-x-2 sm:-translate-x-4"
          ref={newsRef}
        >
          <div className="bg-gradient-to-r from-[#7e30e1] to-[#b364ff] text-white px-6 py-3 font-semibold rounded-t-2xl">
            📰 Security Headlines
          </div>
          <div className="h-[400px] px-6 py-4 overflow-hidden group relative">
            <div
              className={`absolute top-0 left-0 right-0 ${
                isInView ? "animation-scroll-news" : ""
              } will-change-transform`}
            >
              <div className="flex flex-col space-y-3">
                {[...dummyNews, ...dummyNews].map((news, index) => (
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
        </div>

        {/* Right: Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 translate-x-2 sm:translate-x-4"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Data Breaches Are a Growing Threat
          </h2>
          <p className="text-[#bcbcbc] text-lg">
            Obscurix helps secure your APIs and credentials with zero-trust principles and advanced scanning — protecting your brand, data, and users from the escalating threat landscape.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-xl p-4 text-center shadow-md"
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-[#b364ff]">
                  {stat.number}
                </h3>
                <p className="text-[#ccc] mt-2 text-sm sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scrollY {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animation-scroll-news {
          animation: scrollY 80s linear infinite; /* Slowed down */
        }

        .group:hover .animation-scroll-news {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
