import { ChatInterface } from "@/components/chat/chat-interface";
import { getConversation } from "@/actions/chat";
import { notFound } from "next/navigation";
import { UIMessage } from "ai";

export default async function ChatDetailPage({ params }: { params: { id: string } }) {
  const conversation = await getConversation(params.id);

  if (!conversation) {
    notFound();
  }

  const initialMessages: UIMessage[] = conversation.messages.map((m) => ({
    id: m.id,
    role: m.role as 'system' | 'user' | 'assistant',
    parts: [{ type: 'text', text: m.content }],
  }));

  return <ChatInterface id={conversation.id} initialMessages={initialMessages} />;
}
