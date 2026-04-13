import { create } from "zustand";
import { SPINNER_VERBS } from "../constants";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ViewState =
  | "idle"
  | "uploading"
  | "chat_loading"
  | "chat_streaming"
  | "error";

interface AppState {
  status: ViewState;
  input: string;
  currentVerb: string;
  messages: Message[];
  streamingMessage: string;
  uploadedFiles: string[];
  error: { title: string; message: string } | null;

  // Actions
  setInput: (value: string) => void;
  clearError: () => void;

  // Async thunks
  uploadFile: (file: File) => Promise<void>;
  sendChat: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  status: "idle",
  input: "",
  currentVerb: "Thinking",
  messages: [
    {
      role: "assistant",
      content:
        "Hello! I've indexed your documents. What would you like to know about your Archive?",
    },
  ],
  streamingMessage: "",
  uploadedFiles: (() => {
    try {
      const saved = localStorage.getItem("archive_files");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),
  error: null,

  setInput: (value: string) => set({ input: value }),
  clearError: () =>
    set((state) => ({
      error: null,
      status: state.status === "error" ? "idle" : state.status,
    })),

  uploadFile: async (file: File) => {
    set({ status: "uploading", error: null });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/ingest", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed response");

      set((state) => {
        const newFiles = [...state.uploadedFiles, file.name];
        localStorage.setItem("archive_files", JSON.stringify(newFiles));
        return {
          status: "idle",
          uploadedFiles: newFiles,
          messages: [
            ...state.messages,
            {
              role: "assistant",
              content: `Successfully indexed: **${file.name}**`,
            },
          ],
        };
      });
    } catch {
      set({
        status: "error",
        error: {
          title: "Upload Failed",
          message:
            "Could not index your file. Please check if the file is a valid PDF or Text file.",
        },
      });
    }
  },

  sendChat: async () => {
    const state = get();
    if (!state.input.trim() || state.status !== "idle") return;

    const userQuery = state.input.trim();
    const randomVerb =
      SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)];

    set({
      status: "chat_loading",
      input: "",
      currentVerb: randomVerb,
      messages: [...state.messages, { role: "user", content: userQuery }],
      streamingMessage: "",
      error: null,
    });

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      set({ status: "chat_streaming" });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        set({ streamingMessage: fullText });
      }

      set((s) => ({
        status: "idle",
        messages: [...s.messages, { role: "assistant", content: fullText }],
        streamingMessage: "",
      }));
    } catch (error) {
      set({
        status: "error",
        error: {
          title: "Chat Error",
          message:
            error instanceof Error
              ? error.message
              : "The AI is having trouble connecting to your archive.",
        },
      });
    }
  },
}));
