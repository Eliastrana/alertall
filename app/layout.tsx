// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import LayoutPadding from "./components/LayoutPadding";

export const metadata = {
    title: "Prosjekt Argus",
    description: "Gjør det mulig for hvem som helst å sjekke om de er i en utsatt sone for flom, skogbrann og hetebølge.",
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
        <LayoutPadding>
            {children}
        </LayoutPadding>
        </body>
        </html>
    );
}