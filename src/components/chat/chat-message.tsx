import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3.5",
          isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"
        )}
      >
        <div className={cn(
          "prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
          isUser ? "text-primary-foreground" : "text-foreground"
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="rounded-md border bg-muted/50 overflow-hidden my-4">
                    <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/80">
                      <span className="text-xs font-mono">{match[1]}</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-sm">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </div>
                  </div>
                ) : (
                  <code className="bg-muted/50 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || (message as any).content || ""}
          </ReactMarkdown>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary border flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
