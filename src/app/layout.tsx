import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import "./globals.css";

export const metadata: Metadata = {
  title: "WastePay | Digital recycling infrastructure",
  description: "Digital infrastructure for plastic collection, recovery, and transparent value distribution.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://wastepay.app"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: theme } = await createAdminClient()
    .from("site_theme")
    .select("primary_color, secondary_color, accent_color, background_color, surface_color, text_color, muted_text_color, font_family, base_font_size_px, heading_scale, border_radius_px")
    .eq("id", true)
    .maybeSingle();
  const style = {
    "--wp-primary": theme?.primary_color ?? "#00d6a3",
    "--wp-secondary": theme?.secondary_color ?? "#172554",
    "--wp-accent": theme?.accent_color ?? "#facc15",
    "--wp-background": theme?.background_color ?? "#020617",
    "--wp-surface": theme?.surface_color ?? "#0f172a",
    "--wp-text": theme?.text_color ?? "#f8fafc",
    "--wp-muted-text": theme?.muted_text_color ?? "#94a3b8",
    "--wp-base-size": `${theme?.base_font_size_px ?? 16}px`,
    "--wp-heading-scale": theme?.heading_scale ?? 1,
    "--wp-radius": `${theme?.border_radius_px ?? 24}px`,
    fontFamily:
      theme?.font_family === "Georgia"
        ? "Georgia, serif"
        : "Inter, Arial, Helvetica, sans-serif",
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body style={style} className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
