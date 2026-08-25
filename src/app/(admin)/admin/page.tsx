import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Dashboard session:", session?.user);

  if (!session) {
    console.log("Redirect: No session");
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  console.log("Dashboard user:", user);

  if (!user || (user as any).role !== "admin") {
    console.log("Redirect: Not admin");
    redirect("/");
  }

  return <DashboardClient user={user} />;
}
