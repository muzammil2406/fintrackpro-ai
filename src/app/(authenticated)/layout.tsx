import Header from "@/components/Header";
import Nav from "@/components/Nav";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { MockAuthProvider } from "@/components/MockAuthProvider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MockAuthProvider>
        <Sidebar>
          <Nav />
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
          </main>
        </SidebarInset>
      </MockAuthProvider>
    </SidebarProvider>
  );
}
