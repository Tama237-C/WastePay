"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

function isIosDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function InstallWastePay() {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  const [showIosInstructions, setShowIosInstructions] =
    useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsInstalled(isStandaloneMode());
    });

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setShowIosInstructions(false);
      setIsInstalled(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled,
    );

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (isInstalled) {
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();

      const choice = await installPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setInstallPrompt(null);
      }

      return;
    }

    if (isIosDevice()) {
      setShowIosInstructions(true);
      return;
    }

    window.alert(
      "Open your browser menu and choose Install app or Add to Home screen. Installation may become available after WastePay is deployed online using HTTPS.",
    );
  };

  return (
    <section className="rounded-[2rem] border border-emerald-400/15 bg-emerald-400/[0.05] p-6 shadow-2xl sm:p-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
            WastePay on your phone
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
            Install the public WastePay experience.
          </h2>

          <p className="mt-4 text-sm font-light leading-7 text-slate-400 sm:text-base">
            Add WastePay to your phone for faster access to collection
            booking, programs, public impact, and partnership information.
          </p>

          <p className="mt-4 text-sm font-bold leading-7 text-amber-200/70">
            This public installation does not provide access to protected
            driver, depot, manager, or administrative tools.
          </p>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          disabled={isInstalled}
          className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 disabled:cursor-default disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isInstalled ? "WastePay installed" : "Install WastePay"}

          {!isInstalled ? (
            <span aria-hidden="true">→</span>
          ) : null}
        </button>
      </div>

      {showIosInstructions ? (
        <div className="mt-7 rounded-3xl border border-sky-400/15 bg-sky-400/[0.055] p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">
            Install on iPhone or iPad
          </p>

          <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <li>
              <strong className="text-white">1.</strong> Open this page using
              Safari.
            </li>

            <li>
              <strong className="text-white">2.</strong> Tap the Share button
              at the bottom of Safari.
            </li>

            <li>
              <strong className="text-white">3.</strong> Scroll and choose Add
              to Home Screen.
            </li>

            <li>
              <strong className="text-white">4.</strong> Tap Add.
            </li>
          </ol>

          <button
            type="button"
            onClick={() => setShowIosInstructions(false)}
            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300"
          >
            Close instructions
          </button>
        </div>
      ) : null}
    </section>
  );
}
