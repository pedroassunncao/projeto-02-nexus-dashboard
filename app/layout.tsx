import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Dashboard | Pedro Assunção",
  description: "Dashboard SaaS demonstrativo desenvolvido em Next.js e TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
