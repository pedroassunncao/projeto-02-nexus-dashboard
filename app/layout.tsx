import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nexus Dashboard | Pedro Assunção",
  description: "Interface SaaS demonstrativa com projetos, métricas, pesquisa, visualização de dados e estados interativos.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Nexus Dashboard | Interface SaaS demonstrativa",
    description: "Projeto frontend responsivo construído com Next.js, TypeScript e CSS.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Nexus Dashboard — Interface SaaS demonstrativa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Dashboard | Interface SaaS demonstrativa",
    description: "Projeto frontend responsivo construído com Next.js, TypeScript e CSS.",
    images: ["/og.png"],
  },
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
