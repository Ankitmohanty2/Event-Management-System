import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function EventCard({ event }) {
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
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="relative w-full overflow-hidden rounded-t-lg bg-gray-100">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="h-48 w-full object-cover transition-transform duration-200 hover:scale-105" 
          />
        ) : (
          <div className="h-48 w-full grid place-items-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={isUpcoming() ? "default" : "secondary"}>
            {isUpcoming() ? "Upcoming" : "Past"}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="flex-1">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTime(event.time)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {event.description && (
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        )}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Event ID: #{event.id}</span>
            <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
