import type { Metadata } from "next";
import { ToastContainer } from "@/components/ui/toast-container";
import "../globals.css";
import { Prompt, Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

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
  title: "Admin Dashboard | Skill Cart",
  description: "Manage your store from the admin panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={cn(jakarta.variable, prompt.variable)}>
      <body className="min-h-screen bg-slate-50">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
