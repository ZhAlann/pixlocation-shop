import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "PixShop",
  description: "Boutique de matériel audiovisuel neuf et d’occasion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#f6f6f8] text-[#1c1c24] antialiased">
        <Navbar />
        <div className="min-h-[calc(100vh-80px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}