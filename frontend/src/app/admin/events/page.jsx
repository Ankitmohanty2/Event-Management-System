"use client";
import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getMe, listEvents } from "@/lib/api";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import EditEventModal from "@/components/EditEventModal";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", image_url: "" });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await listEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const me = await getMe().catch(() => null);
      if (!me || me.role !== "admin") return router.replace("/login");
      await loadEvents();
    })();
  }, [router]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.time) {
      alert("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    try {
      const created = await createEvent(form);
      if (created) {
        setEvents([created, ...events]);
        setForm({ title: "", description: "", date: "", time: "", image_url: "" });
        alert("Event created successfully!");
      }
    } catch (error) {
      alert(error.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = async (id) => {
    const ok = confirm("Are you sure you want to delete this event?");
    if (!ok) return;
    
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
      alert("Event deleted successfully!");
    } catch (error) {
      alert(error.message || "Failed to delete event");
    }
  };

  const clearForm = () => {
    setForm({ title: "", description: "", date: "", time: "", image_url: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <Button 
          onClick={loadEvents} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Event</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input 
                  id="title" 
                  placeholder="Enter event title" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={form.date} 
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={form.time} 
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Event Image</Label>
                <ImageUpload 
                  onImageUpload={(url) => setForm({ ...form, image_url: url })} 
                  currentImage={form.image_url}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your event..." 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={clearForm}
                disabled={submitting}
              >
                Clear Form
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="min-w-[120px]"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">All Events ({events.length})</h2>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-500">Create your first event using the form above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Event</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, idx) => (
                    <tr key={event.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {event.image_url && (
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">ID: {event.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{event.date}</div>
                          <div className="text-gray-500">{event.time}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {event.description}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            className="flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        event={editingEvent}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
}
