const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup(data) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, role: data.role || "normal" }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(credentials) {
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

export async function listEvents(page = 1, pageSize = 10) {
  const res = await fetch(`${API_URL}/events/?page=${page}&page_size=${pageSize}`, { 
    cache: "no-store"
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createEvent(payload) {
  const res = await fetch(`${API_URL}/events/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateEvent(id, payload) {
  console.log("API: Updating event", id, "with payload:", payload);
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", errorText);
    throw new Error(errorText);
  }
  return res.json();
}

export async function deleteEvent(id) {
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
