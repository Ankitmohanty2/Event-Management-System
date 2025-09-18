"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const [open, setOpen] = useState(false);

  const LinkGroup = () => (
    <nav className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm">
      <a className="hover:text-blue-600 transition" href="/events">Events</a>
      {user?.role === "admin" && <a className="hover:text-blue-600 transition" href="/admin/events">Admin</a>}
      {!user && (
        <>
          <a className="hover:text-blue-600 transition" href="/login">Login</a>
          <a className="hover:text-blue-600 transition" href="/signup">Signup</a>
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
    <header className="fixed top-0 z-40 w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-4">
        <a href="/" className="font-semibold tracking-tight">Event Management System</a>
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
