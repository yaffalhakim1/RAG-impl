import { useEffect, useState } from "react";
import { Alert } from "@heroui/react";
import { useAppStore } from "./store/useAppStore";
import { Sidebar } from "./components/Sidebar";
import { ChatHistory } from "./components/ChatHistory";
import { ChatInput } from "./components/ChatInput";

export default function App() {
  const error = useAppStore((state) => state.error);
  const clearError = useAppStore((state) => state.clearError);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onOpenChange = setIsOpen;

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="flex h-screen w-full bg-transparent text-foreground font-sans transition-colors duration-300">
      <Sidebar isOpen={isOpen} onOpenChange={onOpenChange} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 md:px-8 py-6 md:py-10 overflow-hidden bg-background">
        <header className="mb-6 md:mb-8 shrink-0 flex items-center gap-4">
          <button
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-foreground/10 text-foreground"
            onClick={onOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-medium opacity-80">
              Research Assistant
            </h2>
          </div>
        </header>

        <ChatHistory />
        <ChatInput />
      </main>

      {/* Error Overlay - HeroUI Alert */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Alert
            status="danger"
            className="min-w-[300px] shadow-2xl border-none"
          >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{error.title}</Alert.Title>
              <Alert.Description>{error.message}</Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      )}
    </div>
  );
}
