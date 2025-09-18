export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Event Management System</p>
        <div className="flex gap-3">
          <a href="https://github.com/Ankitmohanty2/Event-Management-System" className="hover:underline">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
