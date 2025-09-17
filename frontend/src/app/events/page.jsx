import { listEvents } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default async function EventsPage() {
  const events = await listEvents();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <a className="text-sm underline" href="/admin">Admin</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((e) => (
          <Card key={e.id}>
            <CardHeader>{e.title}</CardHeader>
            <CardContent>
              {e.image_url ? (
                <img src={e.image_url} alt={e.title} className="w-full h-40 object-cover rounded" />
              ) : null}
              <div className="text-xs text-gray-500">{e.date} at {e.time}</div>
              {e.description && <p>{e.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
