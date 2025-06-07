import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head />
      <body
        className={`${montserrat.className} flex h-full flex-col justify-between text-gray-700 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
