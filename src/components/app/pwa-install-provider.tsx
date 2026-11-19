"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type PwaInstallContextValue = {
  installPrompt: InstallPromptEvent | null;
  clearInstallPrompt: () => void;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);
  const clearInstallPrompt = useCallback(() => {
    setInstallPrompt(null);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return (
    <PwaInstallContext.Provider
      value={{
        installPrompt,
        clearInstallPrompt,
      }}
    >
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstallPrompt() {
  const context = useContext(PwaInstallContext);

  if (!context) {
    throw new Error("usePwaInstallPrompt must be used within PwaInstallProvider.");
  }

  return context;
}
