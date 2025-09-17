import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Event Management System",
  description: "Admin and user portal for events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8 min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
