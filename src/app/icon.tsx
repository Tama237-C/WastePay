import { ImageResponse } from "next/og";
import { EcologixMark } from "@/components/brand/ecologix-mark";

export const size = { width: 512, height: 512 };
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
          overflow: "hidden",
          background:
            "radial-gradient(circle at 50% 42%, #0d79d2 0%, #075bb1 55%, #03498f 100%)",
        }}
      >
        <EcologixMark style={{ width: 326, height: 326 }} />
      </div>
    ),
    { ...size },
  );
}
