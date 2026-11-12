import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ModelBench",
  description: "A local AI experimentation lab for prompt and model comparison.",
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
