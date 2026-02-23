import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevShowcase — Developer Portfolio Platform",
  description: "Register, build your developer profile, and showcase your portfolio to the world. Join a community of developers.",
  keywords: ["developer", "portfolio", "showcase", "programming", "coding", "freelance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
