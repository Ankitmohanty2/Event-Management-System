import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function EventCard({ event }) {
  return (
    <Card>
      <CardHeader>{event.title}</CardHeader>
      <CardContent>
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-40 object-cover rounded" />
        ) : null}
        <div className="text-xs text-gray-500">{event.date} at {event.time}</div>
        {event.description && <p>{event.description}</p>}
      </CardContent>
    </Card>
  );
}
