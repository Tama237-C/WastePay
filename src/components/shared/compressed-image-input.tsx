"use client";

import { useState, type ChangeEvent } from "react";

type Props = { id: string; name: string; required?: boolean; className?: string };

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= 500 * 1024) return file;
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "evidence"}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}

export function CompressedImageInput({ id, name, required = false, className }: Props) {
  const [message, setMessage] = useState("");
  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const original = event.currentTarget.files?.[0];
    if (!original) return;
    try {
      const compressed = await compressImage(original);
      if (compressed === original) {
        setMessage(`${Math.ceil(original.size / 1024)} KB selected.`);
        return;
      }
      const files = new DataTransfer();
      files.items.add(compressed);
      event.currentTarget.files = files.files;
      setMessage(`Compressed from ${Math.ceil(original.size / 1024)} KB to ${Math.ceil(compressed.size / 1024)} KB.`);
    } catch {
      setMessage("Image could not be compressed; the original will be uploaded.");
    }
  }
  return <><input id={id} name={name} type="file" accept="image/*" capture="environment" required={required} onChange={onChange} className={className} />{message ? <p className="mt-2 text-xs text-slate-400" role="status">{message}</p> : null}</>;
}
