"use client";
import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getMe, listEvents, updateEvent, Event } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", image_url: "" });

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        if (me.role !== "admin") {
          router.replace("/login");
          return;
        }
        const data = await listEvents();
        setEvents(data);
      } catch (e: any) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createEvent(form as any);
      setEvents([created, ...events]);
      setForm({ title: "", description: "", date: "", time: "", image_url: "" });
    } catch (e: any) {
      alert(e.message || "Create failed");
    }
  };

  const handleUpdate = async (id: number, updates: Partial<Event>) => {
    try {
      const updated = await updateEvent(id, updates);
      setEvents(events.map((e) => (e.id === id ? updated : e)));
    } catch (e: any) {
      alert(e.message || "Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (e: any) {
      alert(e.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin - Manage Events</h1>

      <form onSubmit={handleCreate} className="space-y-3 border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input className="border rounded px-3 py-2" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input className="border rounded px-3 py-2" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="bg-black text-white rounded px-4 py-2">Create Event</button>
      </form>

      <div className="space-y-4">
        {events.map((e) => (
          <div key={e.id} className="border rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="font-medium text-lg">{e.title}</div>
              <div className="space-x-2">
                <button className="text-sm underline" onClick={() => handleUpdate(e.id, { title: prompt("New title", e.title) || e.title })}>Edit</button>
                <button className="text-sm text-red-600 underline" onClick={() => handleDelete(e.id)}>Delete</button>
              </div>
            </div>
            <div className="text-sm text-gray-600">{e.date} at {e.time}</div>
            {e.description && <p className="text-sm">{e.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}


