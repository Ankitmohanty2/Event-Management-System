"use client";
import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getMe, listEvents, updateEvent } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", image_url: "" });

  useEffect(() => {
    (async () => {
      const me = await getMe().catch(() => null);
      if (!me || me.role !== "admin") return router.replace("/login");
      const data = await listEvents();
      setEvents(data);
      setLoading(false);
    })();
  }, [router]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const created = await createEvent(form).catch((e) => alert(e.message));
    if (created) {
      setEvents([created, ...events]);
      setForm({ title: "", description: "", date: "", time: "", image_url: "" });
    }
  };

  const handleUpdate = async (id, updates) => {
    const updated = await updateEvent(id, updates).catch((e) => alert(e.message));
    if (updated) setEvents(events.map((e) => (e.id === id ? updated : e)));
  };

  const handleDelete = async (id) => {
    const ok = confirm("Delete this event?");
    if (!ok) return;
    await deleteEvent(id).catch((e) => alert(e.message));
    setEvents(events.filter((e) => e.id !== id));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Manage Events</h1>

      <form onSubmit={handleCreate} className="rounded-xl bg-white p-5 shadow-md space-y-4 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
        <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[110px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex justify-end">
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">Add Event</button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, idx) => (
              <tr key={e.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-3 font-medium text-gray-900">{e.title}</td>
                <td className="px-4 py-3">{e.date}</td>
                <td className="px-4 py-3">{e.time}</td>
                <td className="px-4 py-3 space-x-2">
                  <button className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1" onClick={() => handleUpdate(e.id, { title: prompt("New title", e.title) || e.title })}>Edit</button>
                  <button className="rounded-md bg-red-600 hover:bg-red-700 text-white px-3 py-1" onClick={() => handleDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
