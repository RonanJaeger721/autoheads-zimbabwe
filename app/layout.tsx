import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Autoheads Zimbabwe — Digital Motoring Community",
  description:
    "Vehicle guides, spares suppliers, mechanics and motoring knowledge for Zimbabwe.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
