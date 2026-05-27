import { ReactNode } from "react";
import { auth } from "@/auth";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBar } from "@/components/layout/StatusBar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <Topbar user={session?.user ?? null} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative overflow-hidden bg-bg-secondary flex flex-col">
          {children}
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
