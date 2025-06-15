"use client";
import { useState } from "react";
import { Mail, Linkedin, Github, Send } from "lucide-react";

export default function FooterContact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nMessage: ${message}`);
    setEmail("");
    setMessage("");
  };

  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-b from-[#1a1a1a] to-black text-white px-6 py-20 mt-[-2px] overflow-hidden"
    >
      {/* Glowing blobs */}
      <div className="absolute top-[-60px] left-[-60px] w-[250px] h-[250px] bg-[#b364ff] opacity-20 rounded-full blur-3xl z-0 animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-[#7e30e1] opacity-20 rounded-full blur-3xl z-0 animate-[pulse_6s_ease-in-out_infinite]" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 justify-between items-start">
        {/* Left Side */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e2e2e2] mb-4">
            Let’s Connect
          </h2>
          <p className="text-[#cccccc] mb-6 max-w-md">
            Have a project in mind or want to enquire about our services? Reach out through any of the platforms below — we're listening!
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              {
                icon: Mail,
                label: "Email",
                href: "mailto:your@email.com",
              },
              {
                icon: Linkedin,
                label: "LinkedIn",
                href: "https://linkedin.com",
              },
              {
                icon: Github,
                label: "GitHub",
                href: "https://github.com/Ron111104/Obscurix.git",
              },
            ].map(({ icon: Icon, label, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                className="group flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1c1c1e]/60 border border-[#2e2e30] hover:shadow-md hover:scale-[1.04] transition-all backdrop-blur-md"
              >
                <Icon className="h-5 w-5 text-[#b364ff] group-hover:animate-wiggle" />
                <span className="text-sm">{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Box */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 bg-[#1c1c1e]/50 backdrop-blur-md border border-[#32214c] rounded-xl p-6 shadow-md flex flex-col gap-4 animate-float"
        >
          <h3 className="text-2xl font-semibold text-[#e0dfff]">Quick Contact</h3>
          <input
            type="email"
            required
            placeholder="Your Email"
            className="px-4 py-3 rounded-md bg-[#0f0f1a] border border-[#32214c] text-white placeholder-gray-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            required
            placeholder="Your Message"
            className="px-4 py-3 rounded-md bg-[#0f0f1a] border border-[#32214c] text-white placeholder-gray-400 focus:outline-none h-28 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#7e30e1] hover:bg-[#a052e1] text-white px-4 py-2 rounded-md transition-all self-start"
          >
            Send Message
          </button>
        </form>
      </div>

      <p className="text-xs text-[#777] text-center mt-16">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>

      {/* Inline custom animation styles */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }

        .animate-wiggle {
          animation: wiggle 1.2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
