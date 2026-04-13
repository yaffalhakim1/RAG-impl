import React, { useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { ChatBubble } from "./ChatBubble";

const getStatusConfig = (verb: string) =>
  ({
    idle: { bg: "bg-accent text-white", label: "Send" },
    uploading: { bg: "bg-foreground/10 text-foreground", label: "Uploading..." },
    chat_loading: { bg: "bg-foreground/10 text-foreground", label: `${verb}...` },
    chat_streaming: { bg: "bg-accent text-white", label: `Receiving...` },
    error: { bg: "bg-danger text-white", label: "Retry" },
  }) as const;

export function ChatHistory() {
  const messages = useAppStore((state) => state.messages);
  const status = useAppStore((state) => state.status);
  const streamingMessage = useAppStore((state) => state.streamingMessage);
  const currentVerb = useAppStore((state) => state.currentVerb);
  const scrollRef = useRef<HTMLDivElement>(null);

  const config = getStatusConfig(currentVerb)[status];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  return (
    <div className="flex-1 flex flex-col gap-4 pr-4 overflow-y-auto min-h-0 pb-4" ref={scrollRef}>
      {messages.map((msg, i) => (
        <ChatBubble key={i} role={msg.role} content={msg.content} />
      ))}

      {status !== "idle" && status !== "uploading" && status !== "error" && (
        <ChatBubble
          role="assistant"
          content={
            status === "chat_loading" || (status === "chat_streaming" && !streamingMessage)
              ? config.label
              : streamingMessage
          }
          isGhost={status === "chat_loading" || (status === "chat_streaming" && !streamingMessage)}
        />
      )}
    </div>
  );
}
