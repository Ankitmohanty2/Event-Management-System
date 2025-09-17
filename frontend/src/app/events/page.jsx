import { listEvents } from "@/lib/api";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
  const events = await listEvents();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <a className="text-sm underline" href="/admin">Admin</a>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-600">No events yet. Admins can create events from the dashboard.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
