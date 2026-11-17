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

  return <div className="mt-2">
    <button type="button" onClick={start} className="rounded-xl border border-violet-300/20 px-3 py-2 text-xs font-bold text-violet-200">Scan with camera</button>
    {running ? <button type="button" onClick={stop} className="ml-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300">Stop camera</button> : null}
    <video ref={videoRef} muted playsInline className={`mt-2 w-full rounded-xl ${running ? "block" : "hidden"}`} />
    {message ? <p role="status" className="mt-2 text-xs text-slate-400">{message}</p> : null}
  </div>;
}
