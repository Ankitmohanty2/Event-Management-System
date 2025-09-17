import { listEvents } from "@/lib/api";

export default async function EventsPage() {
  const events = await listEvents();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((e) => (
          <div key={e.id} className="border rounded-xl p-4 space-y-2">
            <div className="font-medium text-lg">{e.title}</div>
            {e.image_url ? (
              <img src={e.image_url} alt={e.title} className="w-full h-40 object-cover rounded" />
            ) : null}
            <div className="text-sm text-gray-600">{e.date} at {e.time}</div>
            {e.description && <p className="text-sm">{e.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}


