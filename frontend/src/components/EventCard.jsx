import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Image from "next/image";

export default function EventCard({ event }) {
  const router = useRouter();
  const { user } = useAuth();
  const previewText = (text) => {
    if (!text) return "";
    let t = text.replace(/\n-\s+/g, "\n• ").replace(/-\s-\s-\s-\s/g, "— ");
    t = t.replace(/\s{2,}/g, " ");
    return t;
  };
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full flex flex-col bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="relative w-full overflow-hidden bg-slate-100">
          {event.image_url ? (
            <div className="relative h-52 w-full">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
          ) : (
            <motion.div 
              className="h-52 w-full grid place-items-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center">
                <motion.svg 
                  className="w-14 h-14 mx-auto mb-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </motion.svg>
                <p className="text-sm font-medium">No image</p>
              </div>
            </motion.div>
          )}
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Badge variant={isUpcoming() ? "default" : "secondary"} className="shadow-lg">
              {isUpcoming() ? "Upcoming" : "Past"}
            </Badge>
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
      
      <CardHeader className="flex-1 p-6">
        <div className="space-y-3">
          <motion.h3 
            className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {event.title}
          </motion.h3>
          <motion.div 
            className="flex items-center gap-3 text-sm text-slate-600"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <span className="font-semibold">{formatDate(event.date)}</span>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3 text-sm text-slate-600"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <span className="font-semibold">{formatTime(event.time)}</span>
            </div>
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        {event.description && (
          <motion.p 
            className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-4 whitespace-pre-line"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {previewText(event.description)}
          </motion.p>
        )}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => {
                if (!user) {
                  router.push('/login');
                } else {
                  router.push(`/events/${event.id}`);
                }
              }}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <motion.svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ rotate: 12 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </motion.svg>
              View Details
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
