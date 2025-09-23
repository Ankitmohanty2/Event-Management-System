"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const [open, setOpen] = useState(false);

  const LinkGroup = () => (
    <nav className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm">
      <Link className="hover:text-blue-600 transition" href="/events">Events</Link>
      {user?.role === "admin" && (
        <Link className="hover:text-blue-600 transition" href="/admin/events">Admin</Link>
      )}
      {!user && (
        <>
          <Link className="hover:text-blue-600 transition" href="/login">Login</Link>
          <Link className="hover:text-blue-600 transition" href="/signup">Signup</Link>
        </>
      )}
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-gray-700">{user.name} ({user.role})</span>
          <button onClick={logout} className="text-sm underline">Logout</button>
        </div>
      )}
    </nav>
  );

  return (
    <header className="fixed top-0 z-40 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight hover:text-blue-600 transition">Event Management System</Link>
        <div className="hidden md:block">
          <LinkGroup />
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3">
          <LinkGroup />
        </div>
      )}
    </header>
  );
}
