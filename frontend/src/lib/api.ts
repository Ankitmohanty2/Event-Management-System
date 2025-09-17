const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Credentials = { email: string; password: string };
export type SignupPayload = { name: string; email: string; password: string; role?: "admin" | "normal" };

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup(data: SignupPayload) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, role: data.role || "normal" }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(credentials: Credentials) {
  const form = new URLSearchParams();
  form.append("username", credentials.email);
  form.append("password", credentials.password);
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}

export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { ...getAuthHeaders() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export type Event = {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  image_url?: string;
};

export async function listEvents(): Promise<Event[]> {
  const res = await fetch(`${API_URL}/events/`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createEvent(payload: Omit<Event, "id">) {
  const res = await fetch(`${API_URL}/events/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateEvent(id: number, payload: Partial<Omit<Event, "id">>) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteEvent(id: number) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(await res.text());
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}


