export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Event Management System</p>
        <div className="flex gap-4">
          <a href="https://github.com/Ankitmohanty2/Event-Management-System" className="hover:text-gray-900 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
