import { Suspense } from "react";
import type { Metadata } from "next";
import { Prompt, Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import "../globals.css";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

// ManuVox design system font: Plus Jakarta Sans (docs/design.md §1.2)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const prompt = Prompt({
  weight: ["400", "500", "700"],
  subsets: ["thai"],
  variable: "--font-prompt",
  display: "swap",
});


export const metadata: Metadata = {
  title: "ระบบ E-Commerce COSCI",
  description: "เรียนรู้การเขียน Nex.tjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={cn(jakarta.variable, prompt.variable)}
    >
      <body>
        <Suspense fallback={<div className="h-16 border-b bg-background" />}>
          <Navbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
