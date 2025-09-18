"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DateTimePicker from "react-datetime-picker";
import { getEvent, updateEvent, getMe } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import ImageUpload from "@/components/ImageUpload";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const descRef = useRef(null);
  const addDays = (base, days) => {
    const d = base ? new Date(base) : new Date();
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  };
  const toDateStr = (d) => {
    if (!d) return "";
    const dt = Array.isArray(d) ? d[0] : d;
    if (typeof dt === 'string') return dt; 
    if (!(dt instanceof Date) || isNaN(dt)) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const da = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  };
  const toTimeStr = (d) => {
    if (!d) return "";
    const dt = Array.isArray(d) ? d[0] : d;
    if (typeof dt === 'string') return dt; 
    if (!(dt instanceof Date) || isNaN(dt)) return "";
    const h = String(dt.getHours()).padStart(2, '0');
    const mi = String(dt.getMinutes()).padStart(2, '0');
    return `${h}:${mi}`;
  };
  const buildDateFrom = () => {
    try {
      const date = form.date || toDateStr(new Date());
      const time = form.time || "12:00";
      return new Date(`${date}T${time}`);
    } catch { return new Date(); }
  };
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await getMe().catch(() => null);
        if (!me || me.role !== "admin") {
          router.replace("/login");
          return;
        }
        loadEvent();
      } catch {
        router.replace("/login");
      }
    };
    init();
  }, [params.id, router]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvent(params.id);
      setEvent(data);
      setForm({
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        time: data.time || "",
        image_url: data.image_url || "",
      });
    } catch (err) {
      setError("Event not found or failed to load");
      console.error("Error loading event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.date || !form.time) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const updatePayload = {};
      
      if (form.title !== event.title) updatePayload.title = form.title;
      if (form.description !== event.description) updatePayload.description = form.description;
      if (form.date !== event.date) updatePayload.date = form.date;
      if (form.time !== event.time) updatePayload.time = form.time;
      if (form.image_url !== event.image_url) updatePayload.image_url = form.image_url;

      const updatedEvent = await updateEvent(event.id, updatePayload);
      if (updatedEvent) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Event updated successfully!', variant: 'success' } }));
        }
        router.push(`/events/${event.id}`);
      }
    } catch (error) {
      alert(error.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const applyMarkdown = (type) => {
    if (!descRef.current) return;
    const textarea = descRef.current;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const value = form.description || "";
    const selected = value.slice(start, end);
    let before = value.slice(0, start);
    let after = value.slice(end);

    let nextText = value;
    if (type === "bold") {
      nextText = `${before}**${selected || "bold text"}**${after}`;
    } else if (type === "italic") {
      nextText = `${before}*${selected || "italic text"}*${after}`;
    } else if (type === "bullet") {
      const lines = (selected || "list item").split("\n").map(l => (l.startsWith("- ") ? l : `- ${l}`));
      nextText = `${before}${lines.join("\n")}${after}`;
    }
    setForm({ ...form, description: nextText });
    requestAnimationFrame(() => {
      const pos = (before + (type === "bullet" ? "- " : type === "bold" ? "**" : "*")).length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-slate-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <p className="text-slate-600">Loading event...</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !event) {
    return (
      <motion.div 
        className="min-h-screen bg-slate-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div 
            className="text-center py-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-red-500 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <motion.h3 
              className="text-lg font-medium text-slate-900 mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Event Not Found
            </motion.h3>
            <motion.p 
              className="text-slate-500 mb-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {error}
            </motion.p>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button 
                onClick={() => router.push('/events')} 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Events
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Bar */}
      <div className="relative">
        {/* Navigation */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                onClick={() => router.push(`/events/${event.id}`)}
                className="group flex items-center gap-3 border-slate-200 hover:bg-slate-50"
              >
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: 0 }}
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </motion.svg>
                <span className="font-medium">Back to Event</span>
              </Button>
            </motion.div>
            
            <motion.div>
              <div className="text-right">
                <motion.h1 
                  className="text-3xl sm:text-4xl font-bold text-black"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Edit Event
                </motion.h1>
                <motion.p 
                  className="text-slate-600 mt-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Update event details and information
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

     
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

      
        <motion.div 
          className=""
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="">
            <motion.div 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <form onSubmit={handleSubmit} className="p-8 lg:p-10">
           
                <div className="sticky top-0 z-10 -mx-8 lg:-mx-10 px-8 lg:px-10 py-3 bg-white/90 backdrop-blur border-b flex justify-end gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black hover:bg-black/90 text-white">Save changes</Button>
                </div>
                <div className="space-y-8">
                  {/* Event Image Section */}
                  <motion.div 
                    className="space-y-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <motion.div 
                      className="flex items-center gap-3 mb-6"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.div 
                        className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200"
                      >
                        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-black">Event Image</h2>
                        <p className="text-slate-600">Upload an image for your event</p>
                      </div>
                    </motion.div>
                    <ImageUpload 
                      onImageUpload={(url) => setForm({ ...form, image_url: url })} 
                      currentImage={form.image_url}
                    />
                  </motion.div>

                  {/* Form Fields */}
                  <motion.div 
                    className="space-y-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <motion.div 
                      className="flex items-center gap-3 mb-6"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <motion.div 
                        className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200"
                      >
                        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-black">Event Details</h2>
                        <p className="text-slate-600">Fill the essential information</p>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {[
                        { id: "title", label: "Event Title", type: "text", placeholder: "Enter event title", value: form.title, icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
                        { id: "date", label: "Event Date", type: "date", placeholder: "", value: form.date, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                        { id: "time", label: "Event Time", type: "time", placeholder: "", value: form.time, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
                      ].map((field, index) => (
                        <motion.div 
                          key={field.id}
                          className={`space-y-3 ${field.id === 'title' ? 'md:col-span-12' : 'md:col-span-6'}`}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        >
                          <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <motion.div 
                              className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200"
                            >
                              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                              </svg>
                            </motion.div>
                            <Label htmlFor={field.id} className="text-lg font-semibold text-slate-700">{field.label} *</Label>
                          </motion.div>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {field.id === 'date' ? (
                              <DateTimePicker
                                value={buildDateFrom()}
                                onChange={(val) => setForm({ ...form, date: toDateStr(val) })}
                                calendarIcon={null}
                                clearIcon={null}
                                disableClock
                                format="y-MM-dd HH:mm"
                                className="w-full [&_.react-datetime-picker__wrapper]:border [&_.react-datetime-picker__wrapper]:rounded-md [&_.react-datetime-picker__wrapper]:px-2 [&_.react-datetime-picker__wrapper]:h-12"
                              />
                            ) : field.id === 'time' ? (
                              <DateTimePicker
                                value={buildDateFrom()}
                                onChange={(val) => setForm({ ...form, time: toTimeStr(val) })}
                                calendarIcon={null}
                                clearIcon={null}
                                disableCalendar
                                format="HH:mm"
                                className="w-full [&_.react-datetime-picker__wrapper]:border [&_.react-datetime-picker__wrapper]:rounded-md [&_.react-datetime-picker__wrapper]:px-2 [&_.react-datetime-picker__wrapper]:h-12"
                              />
                            ) : (
                              <Input 
                                id={field.id} 
                                type={field.type}
                                placeholder={field.placeholder} 
                                value={field.value} 
                                onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                                className="border-slate-300 focus:border-slate-900 focus:ring-slate-900 text-lg h-12"
                                required
                              />
                            )}
                          </motion.div>
                          {field.id === 'date' && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {[
                                { label: 'Today', v: addDays(null, 0) },
                                { label: 'Tomorrow', v: addDays(null, 1) },
                                { label: 'Next Week', v: addDays(null, 7) }
                              ].map((d) => (
                                <button
                                  key={d.label}
                                  type="button"
                                  onClick={() => setForm({ ...form, date: d.v })}
                                  className="px-2 py-1 text-xs rounded border hover:bg-slate-50"
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          )}
                          {field.id === 'time' && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {['09:00','12:00','15:00','18:00','20:00'].map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setForm({ ...form, time: t })}
                                  className="px-2 py-1 text-xs rounded border hover:bg-slate-50"
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                      <motion.div 
                        className="space-y-3 md:col-span-12"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                      <motion.div 
                        className="flex items-center justify-between gap-3"
                      >
                          <motion.div 
                            className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200"
                          >
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </motion.div>
                        <Label htmlFor="description" className="text-lg font-semibold text-slate-700">Event Description *</Label>
                        {/* Toolbar */}
                        <div className="ml-auto flex items-center gap-2">
                          <button type="button" onClick={() => applyMarkdown("bold")} className="px-2 py-1 rounded border text-sm hover:bg-slate-50">B</button>
                          <button type="button" onClick={() => applyMarkdown("italic")} className="px-2 py-1 rounded border text-sm hover:bg-slate-50 italic">I</button>
                          <button type="button" onClick={() => applyMarkdown("bullet")} className="px-2 py-1 rounded border text-sm hover:bg-slate-50">• List</button>
                        </div>
                        </motion.div>
                        <motion.div>
                          <Textarea 
                            id="description" 
                          ref={descRef}
                            placeholder="Describe your event in detail..." 
                            value={form.description} 
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={10}
                            className="border-slate-300 focus:border-slate-900 focus:ring-slate-900 text-lg h-48"
                            required
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
