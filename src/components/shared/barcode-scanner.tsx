"use client";

import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { useEffect, useId, useRef, useState } from "react";

export function BarcodeScanner({
  inputId,
  onScan,
}: {
  inputId: string;
  onScan?: (decodedText: string) => void;
}) {
  const generatedId = useId().replace(/:/g, "");
  const scannerId = `barcode-reader-${generatedId}`;
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startingRef = useRef(false);
  const mountedRef = useRef(false);
  const scanHandledRef = useRef(false);
  const [message, setMessage] = useState("");
  const [starting, setStarting] = useState(false);
  const [running, setRunning] = useState(false);

  async function stop() {
    const scanner = scannerRef.current;

    if (!scanner) {
      setRunning(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }

      scanner.clear();
    } catch (error) {
      console.error("ECOLOGIX could not stop the barcode scanner.", error);
      setMessage(
        "The camera could not be stopped cleanly. Close this screen before starting another scan.",
      );
    } finally {
      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }
      setRunning(false);
    }
  }

  async function start() {
    if (startingRef.current || running) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage(
        "This browser cannot open the camera. Enter the material code manually.",
      );
      return;
    }

    startingRef.current = true;
    scanHandledRef.current = false;
    setStarting(true);
    setMessage("Starting the camera. Allow camera access if prompted.");

    const scanner = new Html5Qrcode(scannerId, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.QR_CODE,
      ],
      verbose: false,
    });
    scannerRef.current = scanner;

    try {
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });

      if (!mountedRef.current) {
        scanner.clear();
        if (scannerRef.current === scanner) {
          scannerRef.current = null;
        }
        return;
      }

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 260, height: 140 },
          aspectRatio: 1.777778,
        },
        (decodedText) => {
          if (scanHandledRef.current) {
            return;
          }
          scanHandledRef.current = true;

          const input = document.getElementById(inputId);

          if (!(input instanceof HTMLInputElement)) {
            setMessage(
              "The code was scanned, but the material-code field is unavailable. Enter it manually.",
            );
            void stop();
            return;
          }

          input.value = decodedText;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          onScan?.(decodedText);
          setMessage(`Captured material code: ${decodedText}`);
          void stop();
        },
        () => undefined,
      );

      if (!mountedRef.current) {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
        if (scannerRef.current === scanner) {
          scannerRef.current = null;
        }
        return;
      }

      if (scanHandledRef.current) {
        return;
      }

      setRunning(true);
      setMessage("Camera active. Center the barcode in the scan area.");
    } catch (error) {
      console.error("ECOLOGIX could not start the barcode scanner.", error);
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
      } catch (clearError) {
        console.error("ECOLOGIX could not clear the barcode scanner.", clearError);
      }
      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }
      setRunning(false);
      setMessage(
        "The camera could not start. Check camera permission and try again, or enter the material code manually.",
      );
    } finally {
      startingRef.current = false;
      if (mountedRef.current) {
        setStarting(false);
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const scanner = scannerRef.current;

      if (startingRef.current) {
        return;
      }

      scannerRef.current = null;

      if (!scanner) {
        return;
      }

      const cleanup = scanner.isScanning
        ? scanner.stop().then(() => scanner.clear())
        : Promise.resolve().then(() => scanner.clear());

      void cleanup.catch((error: unknown) => {
        console.error(
          "ECOLOGIX could not clean up the barcode scanner.",
          error,
        );
      });
    };
  }, []);

  return (
    <div className="mt-3 rounded-2xl border border-violet-300/15 bg-violet-400/[0.05] p-3">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={start}
          disabled={starting || running}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/15 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-violet-100 transition hover:bg-violet-400/25 disabled:cursor-wait disabled:opacity-60"
        >
          <span className="text-base" aria-hidden="true">
            âŒ
          </span>
          {starting
            ? "Starting camera"
            : running
              ? "Scanner active"
              : "Scan with camera"}
        </button>
        {running ? (
          <button
            type="button"
            onClick={() => void stop()}
            className="min-h-11 rounded-xl border border-white/10 px-3 text-xs font-bold text-slate-300"
          >
            Stop
          </button>
        ) : null}
      </div>
      <div
        id={scannerId}
        className={`mt-3 overflow-hidden rounded-xl bg-black ${
          running || starting ? "block" : "hidden"
        }`}
        aria-label="Barcode camera preview"
      />
      <p className="mt-2 text-xs text-slate-400" role="status" aria-live="polite">
        {message ||
          "Aim at a barcode in good light. You can always type the code instead."}
      </p>
    </div>
  );
}
