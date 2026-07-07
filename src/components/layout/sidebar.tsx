import Link from "next/link";
import { Plus, MessageSquare, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConversations } from "@/actions/chat";

export async function Sidebar() {
  const conversations = await getConversations();

  return (
    <div className="w-[260px] h-full flex flex-col bg-muted/20 border-r p-3 gap-2 shrink-0">
      <Link href="/chat">
        <Button className="w-full justify-start gap-2" variant="outline">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </Link>
      
      <div className="flex-1 overflow-y-auto mt-4 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">Recent Chats</div>
        {conversations.length === 0 ? (
          <div className="text-sm text-muted-foreground px-2 py-4">No recent chats.</div>
        ) : (
          conversations.map((conv) => (
            <Link key={conv.id} href={`/chat/${conv.id}`}>
              <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 px-2 text-left font-normal truncate">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </Button>
            </Link>
          ))
        )}
      </div>

      <div className="mt-auto border-t pt-2 gap-1 flex flex-col">
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="w-4 h-4" />
            Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
