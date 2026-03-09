import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Car Storage Directory";
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 24, color: "#60a5fa", fontWeight: 600, marginBottom: "16px" }}>
          AutoVault
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, color: "white" }}>
          Car Storage in {cityName}
        </div>
        <div style={{ fontSize: 28, color: "#93c5fd", marginTop: "12px" }}>
          {stateName}
        </div>
        <div style={{ fontSize: 18, color: "#94a3b8", marginTop: "24px" }}>
          Compare facilities · Read reviews · Contact directly
        </div>
      </div>
    ),
    { ...size }
  );
}
