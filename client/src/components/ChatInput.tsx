import React from "react";
import { Input, Button } from "@heroui/react";
import { useAppStore } from "../store/useAppStore";

const getStatusConfig = (verb: string) =>
  ({
    idle: { bg: "bg-accent text-white", label: "Send" },
    uploading: { bg: "bg-foreground/10 text-foreground", label: "Uploading..." },
    chat_loading: { bg: "bg-foreground/10 text-foreground", label: `${verb}...` },
    chat_streaming: { bg: "bg-accent text-white", label: `Receiving...` },
    error: { bg: "bg-danger text-white", label: "Retry" },
  }) as const;

export function ChatInput() {
  const input = useAppStore((state) => state.input);
  const status = useAppStore((state) => state.status);
  const currentVerb = useAppStore((state) => state.currentVerb);
  
  const setInput = useAppStore((state) => state.setInput);
  const sendChat = useAppStore((state) => state.sendChat);

  const config = getStatusConfig(currentVerb)[status];

  return (
    <footer className="mt-4 md:mt-8 shrink-0 flex gap-2 md:gap-4 items-center">
      <Input
        placeholder="Ask your archive..."
        className="flex-1 text-base text-foreground [&_input]:text-foreground rounded-2xl bg-foreground/5 hover:bg-foreground/10 focus-within:bg-foreground/10 transition-colors h-14 px-4 border-none shadow-none"
        value={input}
        onInput={(e: React.FormEvent<HTMLInputElement>) => setInput(e.currentTarget.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendChat()}
        disabled={status !== "idle"}
      />
      <Button
        onPress={sendChat}
        className={`rounded-2xl px-8 h-14 font-medium transition-all ${config.bg}`}
        isPending={status === "chat_loading"}
        isDisabled={status !== "idle"}
      >
        {config.label}
      </Button>
    </footer>
  );
}
