"use client";
import { useEffect, useState } from "react";

export default function Toaster() {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onToast = (e) => {
      const id = Math.random().toString(36).slice(2);
      const { message, variant = "success" } = e.detail || {};
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  const bgByVariant = (v) =>
    v === "error" ? "bg-red-600" : v === "warning" ? "bg-amber-500" : "bg-emerald-600";

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed top-6 right-6 z-[9999] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${bgByVariant(t.variant)} text-white rounded-lg shadow-lg px-4 py-2 min-w-[240px] pointer-events-auto`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}


