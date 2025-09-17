export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <a href="/" className="font-semibold tracking-tight">EventMS</a>
        <nav className="flex items-center gap-4 text-sm">
          <a className="hover:underline" href="/events">Events</a>
          <a className="hover:underline" href="/admin">Admin</a>
          <a className="hover:underline" href="/login">Login</a>
          <a className="hover:underline" href="/signup">Signup</a>
        </nav>
      </div>
    </header>
  );
}
