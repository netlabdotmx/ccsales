import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CCS | Tecnología Enterprise B2B", template: "%s | CCS" },
  description:
    "Distribuidores certificados de Cisco, Fortinet, Aruba, HPE, Lenovo y más. Precios por volumen y soporte técnico especializado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
