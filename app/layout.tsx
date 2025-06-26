import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payload JWT Secret Finder",
  description:
    "Find the JWT Secret used to sign the jwt tokens in Payload CMS backend using payload secret",
  generator: "v0.dev",
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
