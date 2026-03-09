import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AutoVault - Find Car Storage Near You";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            AutoVault
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#93c5fd",
              fontWeight: 500,
            }}
          >
            Find Car Storage Near You
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            2,000+ Facilities · 50+ Cities · Free to Search
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
