"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.setItem("user", null);
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUsername(null);
    setUserRole(null);
    setProfileOpen(false);
    setMenuOpen(false);

    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUsername(user.username || "User");
        setUserRole(user.usertype === "admin" || user.usertype === "user" ? user.usertype : null);
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      setUserRole(null);
    }
  }, [pathname]);

  const linkStyle =
    "hover:text-[#b364ff] transition duration-300 text-base md:text-lg";

  return (
    <div className="w-full fixed top-2 z-50 font-geist mt-4 px-6">
      {/* Desktop Navbar */}
      <div className="hidden md:flex relative items-center justify-between max-w-7xl mx-auto">
        <div className="flex-shrink-0">
          <Link href="/">
            <div className="text-4xl font-extrabold text-[#7e30e1]">Obscurix</div>
          </Link>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="backdrop-blur-md bg-[#1d1f2f]/70 rounded-full px-10 py-4 shadow-md border border-[#32214c]">
            <nav className="flex gap-6 text-white font-medium whitespace-nowrap">
              <Link href="/"><button className={linkStyle}>Home</button></Link>
              <button onClick={() => handleScroll("news")} className={linkStyle}>About</button>
              <button onClick={() => handleScroll("services")} className={linkStyle}>Services</button>
              <Link href="/redactify"><button className={linkStyle}>Redactify</button></Link>
              {userRole === "admin" && (
                <Link href="/dashboard"><button className={linkStyle}>Dashboard</button></Link>
              )}
              <button onClick={() => handleScroll("footer")} className={linkStyle}>Contact</button>
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0" ref={dropdownRef}>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg hover:scale-105 transition"
              >
                <UserCircle className="text-white w-6 h-6" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1f1f2f] border border-[#32214c] rounded-lg shadow-md py-2 z-50">
                  <div className="px-4 py-2 text-sm text-white/70 font-semibold">
                    {username}
                  </div>
                  <Link href="/profile">
                    <button className="w-full text-left px-4 py-2 text-white hover:bg-[#2a2a3d]">
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#2a2a3d] flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/login">
              <button className="text-white text-base font-semibold hover:text-[#b364ff] transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden justify-between items-center px-2 py-4 bg-[#12032f]/95 shadow-lg font-geist">
        <Link href="/">
          <div className="text-xl font-bold text-[#7e30e1]">Obscurix</div>
        </Link>
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Slide-In Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0f0f1a]/95 text-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#32214c]">
          <h2 className="text-xl font-bold text-[#7e30e1]">Menu</h2>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex flex-col h-full justify-center items-center font-geist">
          <nav className="flex flex-col gap-6 text-lg font-medium text-center">
            <button onClick={() => handleScroll("hero")} className="hover:text-[#b364ff] transition">Home</button>
            <button onClick={() => handleScroll("news")} className="hover:text-[#b364ff] transition">About</button>
            <button onClick={() => handleScroll("services")} className="hover:text-[#b364ff] transition">Services</button>
            <Link href="/redactify">
              <button className="hover:text-[#b364ff] transition">Redactify</button>
            </Link>
            {userRole === "admin" && (
              <Link href="/dashboard">
                <button className="hover:text-[#b364ff] transition">Dashboard</button>
              </Link>
            )}
            <button onClick={() => handleScroll("footer")} className="hover:text-[#b364ff] transition">Contact</button>
            {!isLoggedIn ? (
              <Link href="/login">
                <button className="hover:text-[#b364ff] transition">Login</button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="hover:text-[#b364ff] transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
