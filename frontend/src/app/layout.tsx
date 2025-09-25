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
          <main className="max-w-7xl mx-auto px-4 pt-24 pb-14 min-h-[72vh]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
