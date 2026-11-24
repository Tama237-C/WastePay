"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { EcologixMark } from "@/components/brand/ecologix-mark";

export function AppSplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      router.replace("/app/account");
    }, 1900);

    return () => window.clearTimeout(timeout);
  }, [router]);

  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center text-white"
      style={{
        background:
          "radial-gradient(ellipse at 50% 34%, rgba(15, 127, 230, 0.48), transparent 48%), linear-gradient(165deg, #086ecb 0%, #075bb1 48%, #03478f 100%)",
      }}
      aria-label="ECOLOGIX app loading screen"
    >
      <div className="flex flex-col items-center">
        <EcologixMark className="h-[4.5rem] w-[4.5rem] drop-shadow-[0_8px_20px_rgba(0,35,84,0.35)]" />
        <h1 className="mt-3 text-[1.65rem] font-black tracking-[-0.045em] text-white">
          ECOLOGIX
        </h1>
        <p className="mt-0.5 text-[0.78rem] font-medium tracking-[0.01em] text-white/95">
          From Waste to Value, Digitally.
        </p>

        <span
          aria-hidden="true"
          className="mt-9 h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-emerald-300 border-r-emerald-300/70"
        />
        <p
          role="status"
          aria-live="polite"
          className="mt-8 max-w-[11rem] text-[0.7rem] font-medium leading-[1.35] text-white/95"
        >
          Connecting Cameroon’s
          <br />
          Circular Economy
        </p>
      </div>

      <noscript>
        <a
          href="/app/account"
          className="absolute bottom-8 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white"
        >
          Open ECOLOGIX
        </a>
      </noscript>
    </main>
  );
}
