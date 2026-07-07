"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { User, Mail, MessageSquare, Hash, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  stats: {
    totalConversations: number;
    totalMessages: number;
  };
}

export function ProfileClient({ user, stats }: ProfileClientProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
  };

  return (
    <div className="space-y-6">
      {/* Avatar & Basic Info */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center text-2xl font-bold text-primary select-none">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{user.name}</h2>
            <p className="text-muted-foreground text-sm truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground/60 mt-1 font-mono truncate">
              ID: {user.id}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Conversations</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalConversations}</div>
        </div>
        <div className="rounded-2xl border bg-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-4 h-4" />
            <span className="text-sm font-medium">Messages Sent</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalMessages}</div>
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Account Info
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Full Name</div>
              <div className="text-sm font-medium truncate">{user.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm font-medium truncate">{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-3">
        <h3 className="font-semibold text-sm text-destructive/80 uppercase tracking-wider">
          Account Actions
        </h3>
        <p className="text-sm text-muted-foreground">
          Sign out of your account on this device.
        </p>
        <Button
          variant="destructive"
          onClick={handleSignOut}
          disabled={signingOut}
          className="gap-2"
          id="sign-out-btn"
        >
          <LogOut className="w-4 h-4" />
          {signingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
}
