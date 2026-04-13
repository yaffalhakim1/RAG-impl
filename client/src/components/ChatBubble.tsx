import React from "react";
import { Card } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isGhost?: boolean;
}

export function ChatBubble({ role, content, isGhost }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`rounded-2xl w-fit max-w-[85%] border-none shadow-sm 
          ${isUser ? "bg-foreground/10 text-foreground" : "bg-foreground/5 text-foreground"} 
          ${isGhost ? "opacity-50 animate-pulse" : ""}
        `}
      >
        <div className={`py-4 px-6 text-base leading-relaxed tracking-normal`}>
          {/* Header Tag inside bubble */}
          <div className={`text-xs font-semibold mb-2 ${isUser ? "text-foreground/60" : "text-foreground/40"}`}>
            {isUser ? "You" : "Archive"}
          </div>

          <ReactMarkdown
            components={{
              p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 font-mono text-[13px]" {...props} />,
              li: ({ ...props }) => <li className="" {...props} />,
              strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
              h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
              h2: ({ ...props }) => <h2 className="text-xl font-semibold opacity-90 mb-3 mt-5" {...props} />,
              h3: ({ ...props }) => <h3 className="text-lg font-medium opacity-80 mb-2 mt-4" {...props} />,

              code(props: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <div className="my-3 overflow-hidden rounded-lg outline outline-foreground/10 shadow-lg bg-[#1E1E1E]">
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      language={match[1]}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, fontSize: "13px" }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    {...rest}
                    className="bg-foreground/5 border border-foreground/10 font-mono px-1.5 py-0.5 rounded-sm text-[12px] tracking-wide text-current"
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}
