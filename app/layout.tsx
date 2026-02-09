// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import LayoutPadding from "./components/LayoutPadding";

export const metadata = {
    title: "Prosjekt Argus",
    description: "Forbedre oversikten over kaskadeeffekter av naturkatastrofer i Norge ved å utvikle et system som kombinerer spatio-temporal maskinlæring med interaktive kartvisualiseringe.",
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