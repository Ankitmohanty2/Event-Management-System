import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-[78vh] flex items-center justify-center overflow-hidden">
      <Image src="/newback.jpg" alt="Background" fill priority className="absolute inset-0 object-cover -z-20 opacity-25" />
      <div className="relative z-10 w-full max-w-6xl px-4">
        <div className="rounded-2xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border shadow-sm p-8 md:p-14">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Event Management System</h1>
          <p className="max-w-3xl text-gray-600 mt-4 text-lg">Create and explore events with a clean, modern interface. Admins can manage events, while users can browse upcoming sessions easily.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link className="px-5 py-3 rounded-lg bg-black text-white hover:bg-neutral-900 transition shadow-sm" href="/events">View Events</Link>
            <Link className="px-5 py-3 rounded-lg border hover:bg-gray-50 transition shadow-sm" href="/admin/events">Admin Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
