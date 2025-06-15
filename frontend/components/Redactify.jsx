"use client";

import { useEffect, useState, useRef } from "react";
import { SendHorizonal, Menu, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const backendUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
    : process.env.NEXT_PUBLIC_BACKEND_URL_PROD;

const redactText = async (input, mode) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const res = await fetch("/api/redact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input, mode, email }),
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
  const [mode, setMode] = useState("strict");
  const chatBoxRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) router.push("/login");
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = { sender: "user", text: input, time: timestamp };

    setChat((prev) => [...prev, userMessage]);
    setCurrentSession((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const outputs = await redactText(input, mode);
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
    const botMessage = { sender: "bot", text: selectedText, time };
    setChat((prev) => [...prev.filter((m) => m.type !== "options"), botMessage]);
    setCurrentSession((prev) => [...prev.filter((m) => m.type !== "options"), botMessage]);
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
    <div className="min-h-screen flex text-white font-geist text-lg relative">
      {/* Mode Toggle */}
      <div className="fixed bottom-6 left-4 z-50">
        <div className="flex items-center gap-2 bg-[#1e153a] border border-[#32214c] px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm text-[#ccc]">Mode:</span>
          <button
            onClick={() => setMode((prev) => (prev === "strict" ? "creative" : "strict"))}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1 ${
              mode === "strict" ? "bg-[#7e30e1] text-white" : "bg-[#b364ff] text-black"
            }`}
          >
            <Sparkles className="w-4 h-4" /> {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        </div>
        </div>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-[200px] h-full bg-[#14072f] z-50 px-4 py-6 shadow-xl border-r border-[#32214c] flex flex-col md:hidden"
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#b364ff] mb-6">Redactify</h2>
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

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[200px] h-full bg-[#14072f] px-4 py-6 shadow-xl border-r border-[#32214c]">
        <h2 className="text-xl font-bold text-[#b364ff] mb-6 mt-2">Redactify</h2>
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
      </aside>

      {/* Sidebar Toggle (Mobile) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden bg-[#14072f] p-2 rounded-lg border border-[#32214c]"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Chat Section */}
      <main className="flex-1 flex flex-col bg-[#0f0f1a] min-w-0">
        <div className="mt-20 md:mt-16 px-6 py-4 border-b border-[#32214c] text-2xl font-semibold backdrop-blur-md bg-[#0f0f1a]/70">
           
        </div>

        <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#0f0f1a]">
          {chat.map((msg, i) => {
            if (msg.type === "options") {
              return (
                <div key={i} className="flex flex-col gap-2">
                  {msg.options && Array.isArray(msg.options) && msg.options.map((opt, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-[#2d2b45] text-white p-4 rounded-lg border border-[#32214c]"
  >
    {opt}
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
