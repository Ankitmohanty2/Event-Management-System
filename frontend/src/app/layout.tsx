import "./globals.css";
import Navbar from "@/components/Navbar";
import Toaster from "@/components/ui/Toaster";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Event Management System",
  description: "Admin and user portal for events",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <Toaster />
          <main className="max-w-6xl mx-auto px-4 pt-24 pb-10 min-h-[70vh]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
