"use client";

import { useRef, useState } from "react";

type BarcodeDetectorLike = { detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>> };
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

export function BarcodeScanner({ inputId }: { inputId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);

  function stop() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setRunning(false);
  }

  async function start() {
    const Detector = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
    if (!Detector || !navigator.mediaDevices?.getUserMedia) {
      setMessage("Camera barcode scanning is not supported by this browser. Enter the code manually.");
      return;
    }
    try {
      stop();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setRunning(true);
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      const detector = new Detector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "qr_code"] });
      timerRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;
        const result = await detector.detect(videoRef.current);
        const barcode = result[0]?.rawValue;
        if (!barcode) return;
        const input = document.getElementById(inputId) as HTMLInputElement | null;
        if (input) {
          input.value = barcode;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        setMessage(`Captured ${barcode}`);
        stop();
      }, 500);
    } catch {
      setMessage("Camera access was unavailable. Enter the barcode manually.");
      stop();
    }
  }

  return <div className="mt-3 rounded-2xl border border-violet-300/15 bg-violet-400/[0.05] p-3">
    <div className="flex items-center justify-between gap-3">
      <button type="button" onClick={start} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/15 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-violet-100 transition hover:bg-violet-400/25"><span className="text-base">⌁</span>{running ? "Scanner active" : "Scan with camera"}</button>
      {running ? <button type="button" onClick={stop} className="min-h-11 rounded-xl border border-white/10 px-3 text-xs font-bold text-slate-300">Stop</button> : null}
    </div>
    <div className={`relative mt-3 overflow-hidden rounded-xl bg-black ${running ? "block" : "hidden"}`}><video ref={videoRef} muted playsInline className="aspect-video w-full object-cover opacity-80" /><span className="pointer-events-none absolute inset-[18%_12%] rounded-xl border-2 border-violet-300/80 shadow-[0_0_30px_rgba(167,139,250,.45)]" /></div>
    {message ? <p role="status" className="mt-2 text-xs text-slate-400">{message}</p> : <p className="mt-2 text-[0.68rem] leading-5 text-slate-500">Aim at a barcode in good light. You can always type the number instead.</p>}
  </div>;
}
