"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Square, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useMemo } from "react";
import { UIMessage } from "ai";
import { ChatMessage } from "@/components/chat/chat-message";
import { ModelSelector, MODELS, type ModelId } from "@/components/chat/model-selector";
import { useRouter } from "next/navigation";

export function ChatInterface({ initialMessages = [], id }: { initialMessages?: UIMessage[], id?: string }) {
  const router = useRouter();

  // Generate a stable conversation ID if none provided (new chat)
  const conversationId = useMemo(() => id ?? crypto.randomUUID(), [id]);

  const [selectedModel, setSelectedModel] = useState<ModelId>("gemini-3.5-flash");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        conversationId,
        modelId: selectedModel,
      },
    }),
    id: conversationId,
    messages: initialMessages,
  });

  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<{ url: string, name: string, type: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refresh sidebar when a streaming response finishes (conversation saved to DB)
  const prevStatus = useRef(status);
  useEffect(() => {
    const wasStreaming = prevStatus.current === "streaming" || prevStatus.current === "submitted";
    const isNowReady = status === "ready";
    if (wasStreaming && isNowReady && messages.length > 0) {
      router.refresh();
    }
    prevStatus.current = status;
  }, [status]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setAttachment({ url: data.url, name: data.name, type: data.type });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !attachment) return;

    const parts: any[] = [];
    if (input.trim()) parts.push({ type: "text", text: input });
    if (attachment) {
      if (attachment.type.startsWith("image/")) {
        parts.push({ type: "image", image: attachment.url });
      } else {
        parts.push({ type: "file", data: attachment.url, mimeType: attachment.type });
      }
    }

    sendMessage({ role: "user", parts });

    setInput("");
    setAttachment(null);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isStreaming = status === "submitted" || status === "streaming";
  const currentModel = MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex flex-col h-full bg-background relative">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
        <ModelSelector
          value={selectedModel}
          onChange={setSelectedModel}
          disabled={isStreaming}
        />
        <Button variant="outline" size="sm" onClick={() => {
          const content = messages.map(m => `**${m.role}**:\n${m.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") || m.content || ""}`).join("\n\n---\n\n");
          const blob = new Blob([content], { type: "text/markdown" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `chat-export-${Date.now()}.md`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}>
          Export MD
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
            <h2 className="text-2xl font-semibold">How can I help you today?</h2>
            <p className="text-sm text-muted-foreground">
              Using <span className="font-medium">{currentModel?.name}</span>
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 w-full max-w-4xl mx-auto shrink-0 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col w-full"
        >
          {attachment && (
            <div className="px-4 pt-4 flex items-center gap-2">
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{attachment.name}</span>
                <button type="button" onClick={() => setAttachment(null)} className="ml-2 hover:text-destructive">
                  &times;
                </button>
              </div>
            </div>
          )}
          <div className="relative flex items-end w-full border rounded-2xl bg-muted/50 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all shadow-sm">
            {/* Upload feature disabled
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 bottom-3 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              disabled={uploading}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            */}
            <textarea
              className="flex-1 max-h-48 min-h-[56px] w-full resize-none bg-transparent pl-4 pr-14 py-4 text-base focus:outline-none placeholder:text-muted-foreground"
              placeholder={`Message ${currentModel?.name ?? "AI"}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
              {isStreaming ? (
                <Button type="button" size="icon" variant="destructive" onClick={stop} className="rounded-full h-8 w-8">
                  <Square className="h-4 w-4 fill-current" />
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={(!input.trim() && !attachment) || uploading} className="rounded-full h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-3">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
