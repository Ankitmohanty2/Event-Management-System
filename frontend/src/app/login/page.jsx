"use client";
import { useState } from "react";
import { login, getMe } from "@/lib/api";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      const me = await getMe();
      router.push(me.role === "admin" ? "/admin" : "/events");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>Login</CardHeader>
        <CardContent>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button disabled={loading} className="w-full">{loading ? "Signing in..." : "Login"}</Button>
          </form>
          <p className="text-xs mt-3">No account? <a className="underline" href="/signup">Signup</a></p>
        </CardContent>
      </Card>
    </div>
  );
}
