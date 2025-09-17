export default function Home() {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-semibold">Event Management System</h1>
      <div className="flex gap-3">
        <a className="underline" href="/events">View Events</a>
        <a className="underline" href="/login">Login</a>
        <a className="underline" href="/signup">Signup</a>
        <a className="underline" href="/admin">Admin</a>
      </div>
    </div>
  );
}
