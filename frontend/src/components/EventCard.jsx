import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function EventCard({ event }) {
  return (
    <Card>
      <div className="relative w-full overflow-hidden rounded-lg bg-gray-100">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="h-44 w-full object-cover" />
        ) : (
          <div className="h-44 w-full grid place-items-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <CardHeader className="mt-3 flex items-center justify-between">
        <span>{event.title}</span>
        <Badge>{event.date}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-500 mb-1">{event.time}</div>
        {event.description && <p>{event.description}</p>}
      </CardContent>
    </Card>
  );
}
