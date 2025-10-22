import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Астрологическая Платформа - Натальные карты и Гороскопы",
  description: "Профессиональные астрологические расчеты с AI-интерпретациями. Натальные карты, гороскопы, совместимость и транзиты.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
