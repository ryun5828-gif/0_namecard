import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAN RYUN HEE — Portfolio 2026",
  description: "From the first kick to the next idea. A horizontal journey through origin, odyssey, and selected works.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
