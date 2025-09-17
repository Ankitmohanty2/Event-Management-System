"use client";
import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getMe, listEvents, updateEvent } from "@/lib/api";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function AdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (e) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await createEvent(form);
      setEvents([created, ...events]);
      setForm({ title: "", description: "", date: "", time: "", image_url: "" });
    } catch (e) {
      alert(e.message || "Create failed");
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await updateEvent(id, updates);
      setEvents(events.map((e) => (e.id === id ? updated : e)));
    } catch (e) {
      alert(e.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin - Manage Events</h1>
        <a className="text-sm underline" href="/events">View site</a>
      </div>

      <Card>
        <CardHeader>Create new event</CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button>Create Event</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((e) => (
          <Card key={e.id}>
            <CardHeader>{e.title}</CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500 mb-2">{e.date} at {e.time}</div>
              {e.description && <p className="mb-2">{e.description}</p>}
              <div className="flex gap-3">
                <Button className="bg-gray-900" onClick={() => handleUpdate(e.id, { title: prompt("New title", e.title) || e.title })}>Edit</Button>
                <Button className="bg-red-600 hover:bg-red-500" onClick={() => handleDelete(e.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
