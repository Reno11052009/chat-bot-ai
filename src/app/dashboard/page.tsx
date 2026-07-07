import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/sidebar";
import { Users, MessageSquare, Key, LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const [totalUsers, totalConversations, totalMessages] = await Promise.all([
    prisma.user.count(),
    prisma.conversation.count(),
    prisma.message.count(),
  ]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Overview of platform usage and statistics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <h3 className="font-medium text-sm">Total Users</h3>
              </div>
              <div className="text-3xl font-bold">{totalUsers}</div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <h3 className="font-medium text-sm">Conversations</h3>
              </div>
              <div className="text-3xl font-bold">{totalConversations}</div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <LayoutDashboard className="w-4 h-4" />
                <h3 className="font-medium text-sm">Messages Sent</h3>
              </div>
              <div className="text-3xl font-bold">{totalMessages}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
