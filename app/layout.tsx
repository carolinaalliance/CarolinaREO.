import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Carolina REO | Asset Management",
    template: "%s | Carolina REO",
  },
  description:
    "Institutional real estate asset management from initial assignment through final disposition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
