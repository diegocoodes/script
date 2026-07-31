import type { Metadata } from "next";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Deyvid Infotech",
    template: "%s | Deyvid Infotech",
  },
  description:
    "Gestão de ordens de serviço e documentos da Deyvid Infotech.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full antialiased">
        <a
          href="#conteudo-principal"
          className="skip-link rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Pular para o conteúdo
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
