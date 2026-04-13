import React from "react";
import {
  Drawer,
  Card,
  Button,
} from "@heroui/react";
import { useAppStore } from "../store/useAppStore";

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-80 border-r border-foreground/5 flex-col p-8 gap-8 bg-foreground/5 relative z-10">
        <h1 className="text-2xl font-sans font-bold tracking-tight text-foreground">
          Archive
        </h1>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (HeroUI component) */}
      <Drawer>
        <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
          <Drawer.Content placement="left" className="w-80 max-w-[85vw] m-0! rounded-none!">
            <Drawer.Dialog className="h-full bg-background text-foreground shadow-2xl overflow-hidden rounded-none">
              <Drawer.Header className="flex items-center justify-between border-b border-foreground/5 pt-8 pb-4 px-6 md:px-8">
                <Drawer.Heading className="text-2xl font-sans font-bold tracking-tight text-foreground">
                  Archive
                </Drawer.Heading>
                <Drawer.CloseTrigger className="z-50 bg-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/10 border-none shadow-none rounded-medium w-8 h-8 flex items-center justify-center">
                  <svg
                    className="pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body className="py-6 px-6 md:px-8 overflow-y-auto">
                <SidebarContent />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}

// Internal reusable component
function SidebarContent() {
  const uploadedFiles = useAppStore((state) => state.uploadedFiles);
  const status = useAppStore((state) => state.status);
  const uploadFile = useAppStore((state) => state.uploadFile);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-50">
          Files
        </p>
        {uploadedFiles.length === 0 ? (
          <p className="text-xs text-foreground/40 italic">
            No files uploaded yet.
          </p>
        ) : (
          uploadedFiles.map((filename, idx) => (
            <Card
              key={idx}
              className="rounded-none border border-foreground/10 shadow-none bg-foreground/5 hover:bg-foreground/10 transition-colors"
            >
              <Card.Header>
                <Card.Title className="text-sm font-mono truncate">
                  {filename}
                </Card.Title>
              </Card.Header>
            </Card>
          ))
        )}
      </div>

      <div className="mt-auto pt-8">
        <input
          type="file"
          id="file-upload"
          hidden
          accept=".pdf,.txt,.md"
          onChange={handleFileUpload}
        />
        <Button
          className="rounded-xl w-full font-medium bg-accent text-white hover:opacity-90 transition-opacity"
          isDisabled={status === "uploading"}
          onPress={() => document.getElementById("file-upload")?.click()}
        >
          {status === "uploading" ? "Indexing..." : "Upload Document"}
        </Button>
      </div>
    </>
  );
}
