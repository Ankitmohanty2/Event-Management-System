export default function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Event Management System</h1>
      <p className="max-w-2xl text-gray-600">Create and explore events with a clean, modern interface. Admins can manage events, while users can browse upcoming sessions easily.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a className="px-4 py-2 rounded-md bg-black text-white" href="/events">View Events</a>
        <a className="px-4 py-2 rounded-md border" href="/admin">Admin Dashboard</a>
      </div>
    </div>
  );
}
