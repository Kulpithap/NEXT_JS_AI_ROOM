import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { ShoppingBasket } from "lucide-react";
import CountCartItem from "@/app/(front)/components/CountCartItem";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import LogoutButton from "./logout-button";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  let userRole = "user";
  if (session) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    userRole = (dbUser as any)?.role || "user";
  }

  return (
    <nav className="glass sticky top-0 z-50 h-16">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <Link href="/cart">
          <Badge className="p-2 text-md">
            <ShoppingBasket /> <CountCartItem /> ชิ้น
          </Badge>
        </Link>

        <div className="flex items-center gap-3">
          
          {
            !session && (
              <>
                <Button asChild className="hidden sm:inline-flex" variant="outline">
                  <Link href="/login">เข้าสู่ระบบ</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">สมัครสมาชิก</Link>
                </Button>
              </>
            )
          }

           {
             session && (
               <>
                 {userRole === "admin" && (
                   <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                     <Link href="/dashboard">Dashboard</Link>
                   </Button>
                 )}
                 <div className="flex items-center mr-4">
                   สวัสดี, {session.user.name}
                 </div>
                 <div>
                   <LogoutButton />
                 </div>
               </>
             )
           }

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
