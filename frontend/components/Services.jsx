"use client";
import {
  ShieldCheck,
  Repeat,
  BarChart3,
  Code2,
  Sparkles,
  ShieldOff,
} from "lucide-react";

const services = [
  {
    title: "PII Redaction Engine",
    description:
      "Real-time masking of passwords, emails, API keys, and sensitive info using NLP + regex rules.",
    icon: ShieldCheck,
  },
  {
    title: "Generative AI Rewriting",
    description:
      "Uses Gemini to rephrase inputs while keeping context—ideal for tone softening and privacy.",
    icon: Repeat,
  },
  {
    title: "Admin Monitoring Dashboard",
    description:
      "Live analytics on flagged items like emails, keys, or profanity for behavior insights.",
    icon: BarChart3,
  },
  {
    title: "Code Sanitization & Pseudocode",
    description:
      "Redacts sensitive code and converts to pseudocode—great for safe sharing and reporting.",
    icon: Code2,
  },
  {
    title: "Strict & Creative Redaction Modes",
    description:
      "Strict masks all PII. Creative redacts first, then rewrites content securely with AI.",
    icon: Sparkles,
  },
  {
    title: "Leak Prevention Extension",
    description:
      "Browser plugin that blocks screenshots or pasted content with sensitive data via OCR + NLP.",
    icon: ShieldOff,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative bg-gradient-to-tr from-[#0a0a0a] via-[#121212] to-[#1a1a1a] py-28 text-white scroll-mt-24 overflow-hidden"
    >
      {/* Glowing background effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#b364ff] opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-[#7e30e1] opacity-20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#e2e2e2] mb-16">
          Our Advanced Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-[#1c1c1e]/70 border border-[#2e2e30] backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-[#b364ff]/40 transition-all duration-300 hover:scale-[1.03]"
              >
                <div className="bg-[#7e30e1]/10 p-3 rounded-full w-fit mb-4 transition-transform duration-300 group-hover:rotate-6">
                  <Icon className="h-8 w-8 text-[#b364ff]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-[#cccccc] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
