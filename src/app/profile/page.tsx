import { Sidebar } from "@/components/layout/sidebar";
import { ProfileClient } from "@/components/profile/profile-client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const [totalConversations, totalMessages] = await Promise.all([
    prisma.conversation.count({ where: { userId: session.user.id } }),
    prisma.message.count({
      where: {
        conversation: { userId: session.user.id },
        role: "user",
      },
    }),
  ]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information.
            </p>
          </div>
          <ProfileClient
            user={{
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
              image: session.user.image ?? null,
            }}
            stats={{
              totalConversations,
              totalMessages,
            }}
          />
        </div>
      </div>
    </div>
  );
}
