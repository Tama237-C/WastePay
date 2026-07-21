import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #020617 0%, #07111f 55%, #04150f 100%)",
        }}
      >
        <div
          style={{
            width: 142,
            height: 142,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderRadius: 46,
            border: "1px solid rgba(110, 231, 183, 0.34)",
            background:
              "linear-gradient(145deg, #34d399 0%, #10b981 58%, #059669 100%)",
            boxShadow:
              "0 18px 45px rgba(16,185,129,0.28), inset 0 1px 0 rgba(255,255,255,0.34)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#02140f",
              fontSize: 60,
              fontWeight: 900,
              letterSpacing: "-6px",
              lineHeight: 1,
              transform: "translateX(-2px)",
            }}
          >
            WP
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 16,
              width: 39,
              height: 4,
              borderRadius: 999,
              background: "rgba(2, 20, 15, 0.5)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 17,
            right: 18,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: "#6ee7b7",
            boxShadow: "0 0 12px rgba(110,231,183,0.95)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}