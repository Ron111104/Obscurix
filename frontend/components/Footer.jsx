"use client";
import { Mail, Linkedin, Github, Send } from "lucide-react";

export default function FooterContact() {
  return (
    <footer
    id="footer"
    className="relative bg-gradient-to-b from-[#1a1a1a] to-black text-white py-20 px-6 mt-[-2px]">
      {/* Background Blobs */}
      <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#b364ff] opacity-20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#7e30e1] opacity-20 rounded-full blur-3xl animate-pulse z-0" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#e2e2e2] mb-4">
          Let’s Connect
        </h2>
        <p className="text-[#cccccc] mb-8 max-w-xl mx-auto">
          Have a project in mind or just want to say hi? Reach out through any of the platforms below — we’re listening!
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <a
            href="mailto:your@email.com"
            className="group bg-[#1c1c1e]/60 border border-[#2e2e30] hover:shadow-[#b364ff]/30 hover:scale-105 transition-all duration-300 rounded-xl px-5 py-3 flex items-center gap-2 backdrop-blur-md"
          >
            <Mail className="h-5 w-5 text-[#b364ff] group-hover:animate-pulse" />
            Email
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            className="group bg-[#1c1c1e]/60 border border-[#2e2e30] hover:shadow-[#b364ff]/30 hover:scale-105 transition-all duration-300 rounded-xl px-5 py-3 flex items-center gap-2 backdrop-blur-md"
          >
            <Linkedin className="h-5 w-5 text-[#b364ff] group-hover:animate-pulse" />
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            className="group bg-[#1c1c1e]/60 border border-[#2e2e30] hover:shadow-[#b364ff]/30 hover:scale-105 transition-all duration-300 rounded-xl px-5 py-3 flex items-center gap-2 backdrop-blur-md"
          >
            <Github className="h-5 w-5 text-[#b364ff] group-hover:animate-pulse" />
            GitHub
          </a>
          <a
            href="/contact"
            className="group bg-[#1c1c1e]/60 border border-[#2e2e30] hover:shadow-[#b364ff]/30 hover:scale-105 transition-all duration-300 rounded-xl px-5 py-3 flex items-center gap-2 backdrop-blur-md"
          >
            <Send className="h-5 w-5 text-[#b364ff] group-hover:animate-pulse" />
            Contact Form
          </a>
        </div>

        <p className="text-xs text-[#777] mt-10">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
