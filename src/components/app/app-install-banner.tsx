"use client";

import { useEffect, useState } from "react";

import { usePwaInstallPrompt } from "@/components/app/pwa-install-provider";

function isStandalone(): boolean {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function AppInstallBanner() {
  const { installPrompt, clearInstallPrompt } = usePwaInstallPrompt();
  const [installed, setInstalled] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setInstalled(isStandalone());
      setIsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
    });
    const handleInstalled = () => {
      clearInstallPrompt();
      setInstalled(true);
      setInstructions("ECOLOGIX is installed on this device.");
    };

    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [clearInstallPrompt]);

  async function handleInstall() {
    if (installed) return;

    if (!installPrompt) {
      setInstructions(
        isIos
          ? "In Safari, tap Share, choose Add to Home Screen, then tap Add."
          : "Open your browser menu (⋮) and choose Install app or Add to Home screen. Confirm Install to add ECOLOGIX to your app list.",
      );
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      clearInstallPrompt();
      setInstructions(
        choice.outcome === "accepted"
          ? "Choose Install in the browser prompt. ECOLOGIX will then appear in this device’s app list."
          : "Installation was cancelled. You can install ECOLOGIX later from the browser menu.",
      );
    } catch {
      setInstructions(
        "Open your browser menu and choose Install app or Add to Home screen.",
      );
    }
  }

  return (
    <aside className="wp-app-install-banner" aria-label="Install ECOLOGIX">
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-white">Install ECOLOGIX</p>
        <p className="mt-1 text-xs leading-5 text-slate-300">
          Add the app to your home screen for one-tap access to your dashboard.
        </p>
        {instructions ? (
          <p role="status" className="mt-2 text-xs leading-5 text-emerald-200">
            {instructions}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => void handleInstall()}
        disabled={installed}
        className="shrink-0 rounded-xl bg-emerald-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-emerald-300 disabled:bg-slate-700 disabled:text-slate-300"
      >
        {installed ? "Installed" : "Install app"}
      </button>
    </aside>
  );
}
