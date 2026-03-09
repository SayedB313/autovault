import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Luxury Car Storage Directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  const cityName = city
    .replace(/-[a-z]{2}$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const stateName = state
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

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
          background: "linear-gradient(135deg, #0A0A0A 0%, #1a1510 50%, #141414 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 16, color: "#C4A35A", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "20px" }}>
          AutoVault
        </div>
        <div style={{ fontSize: 52, fontWeight: 300, color: "#F5F0EB" }}>
          Car Storage in {cityName}
        </div>
        <div style={{ fontSize: 28, color: "#9A9590", marginTop: "12px" }}>
          {stateName}
        </div>
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "#C4A35A",
            marginTop: "28px",
          }}
        />
        <div style={{ fontSize: 18, color: "#9A9590", marginTop: "20px" }}>
          Compare facilities · Read reviews · Contact directly
        </div>
      </div>
    ),
    { ...size }
  );
}
