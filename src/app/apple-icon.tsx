import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #030108 0%, #000000 55%)",
          border: "3px solid rgba(0, 240, 255, 0.45)",
          borderRadius: 32,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "0.12em",
          }}
        >
          PL
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#00F0FF",
            letterSpacing: "0.35em",
          }}
        >
          LOCK
        </div>
      </div>
    ),
    { ...size },
  );
}
