import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YESS — 패치 관리 시스템",
  description: "Year-End Self System · 연말정산 패치 관리 + TF 업무 운영 보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
