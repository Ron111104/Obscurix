"use client";

import { useEffect, useState, useRef } from "react";
import { SendHorizonal, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const backendUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
    : process.env.NEXT_PUBLIC_BACKEND_URL_PROD;

const redactText = async (input) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const res = await fetch("/api/redact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: input,
      mode: "strict",
      email: email, // ⬅️ added here
    }),
  });

  if (!res.ok) throw new Error("Failed to fetch redacted response");
  const data = await res.json();
  return data.outputs;
};


export default function RedactifyPage() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentSession, setCurrentSession] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = { sender: "user", text: input, time: timestamp };
    setChat((prev) => [...prev, userMessage]);
    setCurrentSession((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const outputs = await redactText(input);
      const botOptions = {
        sender: "bot",
        type: "options",
        options: outputs,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChat((prev) => [...prev, botOptions]);
      setCurrentSession((prev) => [...prev, botOptions]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        sender: "bot",
        text: "⚠️ Failed to process. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChat((prev) => [...prev, errorMessage]);
      setCurrentSession((prev) => [...prev, errorMessage]);
    }
  };

  const handleOptionSelect = (selectedText, time) => {
    const botMessage = {
      sender: "bot",
      text: selectedText,
      time,
    };

    setChat((prev) => {
      const newChat = [...prev.filter((m) => m.type !== "options"), botMessage];
      return newChat;
    });

    setCurrentSession((prev) => {
      const newSession = [...prev.filter((m) => m.type !== "options"), botMessage];
      return newSession;
    });
  };

  const handleNewChat = () => {
    if (currentSession.length > 0) {
      setHistory((prev) => [...prev, currentSession]);
    }
    setCurrentSession([]);
    setChat([]);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen flex text-white font-geist text-lg">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== "undefined") && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="fixed md:static top-0 left-0 w-[250px] h-full bg-[#14072f] z-40 px-6 py-8 shadow-xl border-r border-[#32214c] md:flex flex-col hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#b364ff]">Redactify</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-white text-sm md:hidden">✕</button>
            </div>
            <button
              className="mb-4 px-3 py-2 rounded-md bg-[#7e30e1] text-white text-sm w-full"
              onClick={handleNewChat}
            >
              + New Chat
            </button>
            <div className="flex flex-col gap-3 overflow-y-auto">
              {history.map((session, i) => (
                <div
                  key={i}
                  className="text-sm px-3 py-2 bg-[#1e153a] rounded-md truncate"
                  title={session[0]?.text}
                >
                  {session[0]?.text?.slice(0, 25) || "Untitled"}
                </div>
              ))}
            </div>
            <Link href="/">
              <button className="mt-6 text-sm text-[#b364ff] hover:underline">Back to Home</button>
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle Sidebar for small screens */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#14072f] p-2 rounded-lg border border-[#32214c]"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Main Chat Section */}
      <main className="flex-1 flex flex-col bg-[#0f0f1a]">
        <div className="mt-20 md:mt-16 px-6 py-4 border-b border-[#32214c] text-2xl font-semibold backdrop-blur-md bg-[#1d1f2f]/70">
          Chat with Redactify
        </div>

        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#0f0f1a]"
        >
          {chat.map((msg, i) => {
            if (msg.type === "options") {
              return (
                <div key={i} className="flex flex-col gap-2">
                  {msg.options.map((opt, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleOptionSelect(opt, msg.time)}
                      className="cursor-pointer max-w-[80%] px-5 py-4 rounded-xl text-lg leading-relaxed bg-[#32214c]/40 text-white hover:bg-[#7e30e1]/30 transition-all"
                    >
                      <div dangerouslySetInnerHTML={{ __html: opt }} />
                    </motion.div>
                  ))}
                </div>
              );
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-[80%] px-5 py-4 rounded-xl text-lg leading-relaxed whitespace-pre-wrap flex flex-col ${
                  msg.sender === "user"
                    ? "ml-auto bg-[#7e30e1]/20 items-end text-right"
                    : "mr-auto bg-[#32214c]/40 items-start text-left"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-[#32214c] bg-[#1d1f2f]/70 flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-lg bg-[#0f0f1a] border border-[#32214c] text-white placeholder-gray-400 focus:outline-none text-lg"
          />
          <button
            onClick={handleSend}
            className="p-3 bg-[#7e30e1] hover:bg-[#a052e1] rounded-full transition-all"
            aria-label="Send"
          >
            <SendHorizonal className="w-5 h-5 text-white" />
          </button>
        </div>
      </main>
    </div>
  );
}
