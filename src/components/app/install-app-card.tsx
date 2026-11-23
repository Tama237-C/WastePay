"use client";

import { useEffect, useState } from "react";
import { usePwaInstallPrompt } from "@/components/app/pwa-install-provider";

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

export function AppInstallCard() {
  const { installPrompt, clearInstallPrompt } = usePwaInstallPrompt();
  const [isInstalled, setIsInstalled] = useState(false);

  const [showIosInstructions, setShowIosInstructions] =
    useState(false);
  const [showBrowserInstructions, setShowBrowserInstructions] =
    useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsInstalled(isStandaloneMode());
    });

    const handleAppInstalled = () => {
      clearInstallPrompt();
      setShowIosInstructions(false);
      setShowBrowserInstructions(false);
      setIsInstalled(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [clearInstallPrompt]);

  const handleInstall = async () => {
    if (isInstalled) {
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();

      const choice = await installPrompt.userChoice;
      clearInstallPrompt();

      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }

      return;
    }

    if (isIosDevice()) {
      setShowIosInstructions(true);
      return;
    }

    setShowBrowserInstructions(true);
  };

  return (
    <section className="wp-install-card rounded-[2rem] border border-emerald-400/15 bg-emerald-400/[0.05] p-6 shadow-2xl sm:p-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="wp-install-card__app-icon">W</div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
            ECOLOGIX app
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
            Keep your ECOLOGIX app one tap away.
          </h2>

          <p className="mt-4 text-sm font-light leading-7 text-slate-400 sm:text-base">
            Install ECOLOGIX on this device to open the app workspace directly
            from your home screen.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span>Fast access</span><span>App workspace</span><span>Home-screen icon</span>
          </div>

          <p className="mt-4 text-sm font-bold leading-7 text-amber-200/70">
            Your account still needs to sign in, and can only open its assigned
            workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          disabled={isInstalled}
          className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 disabled:cursor-default disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isInstalled ? "App installed" : "Install app"}

          {!isInstalled ? (
            <span aria-hidden="true">â†’</span>
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
      {showBrowserInstructions ? (
        <div className="mt-7 rounded-3xl border border-sky-400/15 bg-sky-400/[0.055] p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">
            Install from your browser
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Open the browser menu and choose <strong className="text-white">Install app</strong> or{" "}
            <strong className="text-white">Add to Home screen</strong>.
          </p>
          <button
            type="button"
            onClick={() => setShowBrowserInstructions(false)}
            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300"
          >
            Close instructions
          </button>
        </div>
      ) : null}
    </section>
  );
}
