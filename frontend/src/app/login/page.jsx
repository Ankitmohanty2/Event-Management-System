"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const u = await login(email, password);
      router.push(u.role === "admin" ? "/admin/events" : "/events");
    } catch (err) {
      let msg = "Login failed";
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.detail) msg = parsed.detail;
      } catch {
        if (err?.message) msg = String(err.message);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-4">Login to continue</p>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-3">No account? <a className="text-blue-600 hover:underline" href="/signup">Signup</a></p>
      </div>
    </div>
  );
}
