"use client";
import { useState } from "react";
import { signup } from "@/lib/api";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup({ name, email, password, role });
      router.push("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>Signup</CardHeader>
        <CardContent>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="admin">Admin</option>
            </select>
            <Button disabled={loading} className="w-full">{loading ? "Creating..." : "Signup"}</Button>
          </form>
          <p className="text-xs mt-3">Already have an account? <a className="underline" href="/login">Login</a></p>
        </CardContent>
      </Card>
    </div>
  );
}
