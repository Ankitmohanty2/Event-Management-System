"use client";
import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getMe, listEvents, updateEvent } from "@/lib/api";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import ImageUpload from "@/components/ImageUpload";

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
        <h1 className="text-2xl font-semibold">Manage Events</h1>
        <a className="text-sm underline" href="/events">View site</a>
      </div>

      <Card>
        <CardHeader>Create new event</CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div>
              <ImageUpload 
                onImageUpload={(url) => setForm({ ...form, image_url: url })} 
                currentImage={form.image_url}
              />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" placeholder="Write a short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <Button size="lg">Create Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((e) => (
          <Card key={e.id}>
            <CardHeader className="flex items-center justify-between">
              <span>{e.title}</span>
              <span className="text-xs text-gray-500">{e.date} · {e.time}</span>
            </CardHeader>
            <CardContent>
              {e.description && <p className="mb-3">{e.description}</p>}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => handleUpdate(e.id, { title: prompt("New title", e.title) || e.title })}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(e.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
