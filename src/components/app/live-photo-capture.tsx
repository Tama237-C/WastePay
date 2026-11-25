"use client";

import { useEffect, useRef, useState } from "react";

type LivePhotoCaptureProps = {
  id: string;
  name: string;
};

export function LivePhotoCapture({ id, name }: LivePhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    void videoRef.current.play().catch(() => {
      setErrorMessage("The camera preview could not start. Check camera permission and try again.");
    });
  }, [cameraOpen]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  async function openCamera() {
    setErrorMessage("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Live camera capture is unavailable in this browser. Open ECOLOGIX over HTTPS on your phone and try again.");
      return;
    }

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1600 },
          height: { ideal: 1200 },
        },
      });
      setCameraOpen(true);
    } catch {
      setErrorMessage("Camera access was blocked or unavailable. Allow camera permission and try again.");
    }
  }

  async function capturePhoto() {
    const video = videoRef.current;
    const input = inputRef.current;
    if (!video || !input || video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage("The camera is still starting. Please wait a moment and try again.");
      return;
    }

    const scale = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.84),
    );

    if (!photoBlob) {
      setErrorMessage("The photo could not be prepared. Please take it again.");
      return;
    }

    const photo = new File([photoBlob], `ecologix-scan-${Date.now()}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
    const transfer = new DataTransfer();
    transfer.items.add(photo);
    input.files = transfer.files;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = URL.createObjectURL(photo);
    setPhotoPreview(previewUrlRef.current);
    setErrorMessage("");
    closeCamera();
  }

  function retakePhoto() {
    if (inputRef.current) inputRef.current.value = "";
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPhotoPreview("");
    void openCamera();
  }

  return (
    <div className="space-y-3">
      <input ref={inputRef} id={id} name={name} type="file" accept="image/jpeg" hidden />

      {cameraOpen ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Live camera preview for product photo"
            className="max-h-[60vh] w-full object-contain"
          />
          <div className="flex gap-3 p-3">
            <button
              type="button"
              onClick={() => void capturePhoto()}
              className="min-h-12 flex-1 rounded-xl bg-emerald-400 px-4 text-xs font-black uppercase tracking-[0.12em] text-slate-950"
            >
              Take photo
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="min-h-12 rounded-xl border border-white/15 px-4 text-xs font-bold text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : photoPreview ? (
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
          <img src={photoPreview} alt="Captured product evidence" className="h-20 w-20 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-emerald-100">Live photo captured</p>
            <p className="mt-1 text-xs text-slate-400">This photo will be attached to your scan.</p>
          </div>
          <button
            type="button"
            onClick={retakePhoto}
            className="min-h-11 rounded-xl border border-white/15 px-3 text-xs font-bold text-slate-200"
          >
            Retake
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void openCamera()}
          className="min-h-12 w-full rounded-2xl border border-sky-400/20 bg-sky-400/[0.07] px-5 text-xs font-black uppercase tracking-[0.12em] text-sky-200"
        >
          Take a live photo
        </button>
      )}

      {errorMessage ? <p role="alert" className="text-sm text-amber-200">{errorMessage}</p> : null}
    </div>
  );
}
