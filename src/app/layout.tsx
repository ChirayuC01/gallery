import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <nav className="bg-blue-600 text-white p-4 flex justify-between">
            <div className="text-lg font-semibold">
              <Link href="/home">Home</Link>
            </div>
            <div>
              <Link href="/gallery" className="mr-4">
                Gallery
              </Link>
              <Link href="/upload">Upload</Link>
            </div>
          </nav>
          {children}
          {/* Modal Root for react-modal */}
          <div id="modal-root"></div>
        </AuthProvider>
      </body>
    </html>
  );
}
