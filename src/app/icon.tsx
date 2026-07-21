import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            position: "absolute",
            width: 430,
            height: 430,
            borderRadius: 140,
            border: "2px solid rgba(255, 255, 255, 0.10)",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.015))",
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -90,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: 999,
            background: "rgba(52, 211, 153, 0.18)",
            filter: "blur(70px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -80,
            bottom: -90,
            width: 300,
            height: 300,
            borderRadius: 999,
            background: "rgba(56, 189, 248, 0.13)",
            filter: "blur(80px)",
          }}
        />

        <div
          style={{
            width: 310,
            height: 310,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderRadius: 105,
            border: "2px solid rgba(110, 231, 183, 0.32)",
            background:
              "linear-gradient(145deg, #34d399 0%, #10b981 58%, #059669 100%)",
            boxShadow:
              "0 35px 90px rgba(16,185,129,0.28), inset 0 2px 0 rgba(255,255,255,0.34)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#02140f",
              fontSize: 126,
              fontWeight: 900,
              letterSpacing: "-12px",
              lineHeight: 1,
              transform: "translateX(-5px)",
            }}
          >
            WP
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 35,
              width: 86,
              height: 8,
              borderRadius: 999,
              background: "rgba(2, 20, 15, 0.52)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 56,
            right: 62,
            width: 22,
            height: 22,
            borderRadius: 999,
            background: "#6ee7b7",
            boxShadow: "0 0 28px rgba(110,231,183,0.95)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}