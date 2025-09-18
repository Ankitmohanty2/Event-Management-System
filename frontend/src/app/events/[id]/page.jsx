"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getEvent, getMe } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      try {
        const me = await getMe().catch(() => null);
        if (!me) {
          router.replace('/login');
          return;
        }
        loadEvent();
      } catch {
        router.replace('/login');
      }
    };
    boot();
  }, [params.id, router]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvent(params.id);
      setEvent(data);
    } catch (err) {
      setError("Event not found or failed to load");
      console.error("Error loading event:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const isUpcoming = () => {
    try {
      const eventDate = new Date(`${event.date}T${event.time}`);
      return eventDate > new Date();
    } catch {
      return true;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Event Not Found</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <Button onClick={() => router.push('/events')} className="bg-purple-600 hover:bg-purple-700 text-white">
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
    
      <div className="relative overflow-hidden">
       
        <motion.div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
        
     
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
                onClick={() => router.back()}
                className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200"
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
                <span className="font-medium">Back to Events</span>
              </Button>
            </motion.div>
            
            {user?.role === "admin" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => router.push(`/events/${event.id}/edit`)}
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <motion.svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </motion.svg>
                  Edit Event
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

     
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center gap-3 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isUpcoming() 
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${isUpcoming() ? 'bg-emerald-500' : 'bg-slate-500'}`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                  {isUpcoming() ? "Upcoming Event" : "Past Event"}
                </div>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {event.title}
            </motion.h1>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-slate-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="flex items-center gap-3 group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ scale: { type: "spring", stiffness: 400, damping: 10 }, rotate: { type: "tween", duration: 0.35, ease: "easeInOut" } }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-500">Date</div>
                  <div className="text-lg font-semibold text-slate-900">{formatDate(event.date)}</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ scale: { type: "spring", stiffness: 400, damping: 10 }, rotate: { type: "tween", duration: 0.35, ease: "easeInOut" } }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-500">Time</div>
                  <div className="text-lg font-semibold text-slate-900">{formatTime(event.time)}</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
    
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
        
          <div className="lg:col-span-2 space-y-8">
      
            {event.image_url && (
              <motion.div 
                className="group"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <div className="aspect-[16/9] bg-slate-100">
                    <AnimatePresence>
                      {imageLoading && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.svg 
                            className="w-16 h-16 text-slate-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </motion.svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: imageLoading ? 0 : 1 }}
                      transition={{ duration: 0.7 }}
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </motion.div>
            )}

      
            <motion.div 
              className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ y: -5 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                About This Event
              </motion.h2>
              <motion.div 
                className="prose prose-lg prose-slate max-w-none"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {event.description || "No description provided for this event."}
                </p>
              </motion.div>
            </motion.div>
          </div>


          <div className="space-y-6">
     
            <motion.div 
              className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 lg:p-8"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <motion.h3 
                className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.div>
                Event Details
              </motion.h3>
              
              <div className="space-y-4">
                {[
                  {
                    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
                    label: "Event ID",
                    value: `#${event.id}`,
                    gradient: "from-purple-500 to-purple-600",
                    delay: 1.0
                  },
                  {
                    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                    label: "Created",
                    value: new Date(event.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }),
                    gradient: "from-emerald-500 to-emerald-600",
                    delay: 1.1
                  },
                  {
                    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                    label: "Last Updated",
                    value: new Date(event.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }),
                    gradient: "from-blue-500 to-blue-600",
                    delay: 1.2
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(241, 245, 249, 0.8)"
                    }}
                  >
                    <motion.div 
                      className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ scale: { type: "spring", stiffness: 400, damping: 10 }, rotate: { type: "tween", duration: 0.35, ease: "easeInOut" } }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="text-sm font-medium text-slate-500">{item.label}</div>
                      <div className="font-bold text-slate-900 text-lg">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

       
            {user?.role === "admin" && (
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border border-purple-200 p-6 lg:p-8"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                whileHover={{ y: -5 }}
              >
                <motion.h3 
                  className="text-lg font-bold text-slate-900 mb-4"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  Quick Actions
                </motion.h3>
                <div className="space-y-3">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.5, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => router.push(`/events/${event.id}/edit`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <motion.svg 
                        className="w-4 h-4 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 12 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </motion.svg>
                      Edit Event
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.6, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/admin/events')}
                      className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    >
                      <motion.svg 
                        className="w-4 h-4 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 12 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </motion.svg>
                      Manage All Events
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        </div>
      </div>
    </motion.div>
  );
}