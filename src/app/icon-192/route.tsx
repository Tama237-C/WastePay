import { ImageResponse } from "next/og";

import { EcologixMark } from "@/components/brand/ecologix-mark";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 50% 42%, #0d79d2 0%, #075bb1 55%, #03498f 100%)",
        }}
      >
        <EcologixMark style={{ width: 122, height: 122 }} />
      </div>
    ),
    { width: 192, height: 192 },
  );
}
