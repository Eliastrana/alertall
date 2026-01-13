// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Demokratisert ekstremvær-risiko",
  description: "Koordinat → multi-risiko → kart + forklaringer + usikkerhet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body>
          <Navbar />
          <div className="pt-20">
        {children}
        </div>
        </body>
    </html>
  );
}
