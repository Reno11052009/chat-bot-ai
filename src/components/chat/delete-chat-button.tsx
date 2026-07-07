"use client";

import { Trash2 } from "lucide-react";
import { deleteConversation } from "@/actions/chat";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteChatButton({ id }: { id: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    
    await deleteConversation(id);
    
    if (pathname === `/chat/${id}`) {
      router.push("/chat");
    }
    // Note: revalidatePath in deleteConversation will refresh the sidebar
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity shrink-0 mr-1 disabled:opacity-50"
      title="Delete Chat"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
