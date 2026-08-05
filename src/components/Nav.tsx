'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Wallet,
  Target,
  BarChartBig,
  Settings,
  DollarSign,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/lib/supabase/hooks";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/transactions", icon: <Wallet />, label: "Transactions" },
  { href: "/budgets", icon: <Target />, label: "Budgets" },
  { href: "/analytics", icon: <BarChartBig />, label: "Analytics" },
  { href: "/settings", icon: <Settings />, label: "Settings" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();

  const name = profile?.name ?? "User";
  const email = profile?.email ?? "";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
            <div className="p-1.5 bg-primary rounded-lg">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold font-headline">Finance Tracker</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
         <div className="flex items-center gap-3">
             <Avatar>
                 <AvatarImage src="" alt={name} />
                 <AvatarFallback>{name.charAt(0)}</AvatarFallback>
             </Avatar>
             <div className="flex flex-col overflow-hidden">
                 <span className="font-medium truncate">{name}</span>
                 <span className="text-xs text-sidebar-foreground/70 truncate">{email}</span>
             </div>
             <button onClick={handleLogout} className="ml-auto p-1 rounded-md hover:bg-sidebar-accent" aria-label="Logout">
                <LogOut className="w-5 h-5 text-sidebar-foreground/70 hover:text-sidebar-foreground" />
             </button>
         </div>
      </SidebarFooter>
    </>
  );
}
