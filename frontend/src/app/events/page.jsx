import { listEvents } from "@/lib/api";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
  const events = await listEvents();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <a className="text-sm text-blue-600 hover:underline" href="/admin/events">Admin</a>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-600">No events yet. Admins can create events from the dashboard.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <div key={e.id} className="transform-gpu transition duration-200 hover:scale-[1.02]">
              <EventCard event={e} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
