"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const me = await getMe().catch(() => null);
        if (!me || me.role !== "admin") {
          router.replace("/login");
          return;
        }
        setAllowed(true);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-600">
        Checking permissions...
      </div>
    );
  }
  if (!allowed) return null;
  return children;
}


