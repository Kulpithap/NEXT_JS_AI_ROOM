import type { Metadata } from "next";

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
    <html lang="th">
      <body>
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
