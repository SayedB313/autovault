import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Car Storage Facility";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facilityName = slug
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
          justifyContent: "flex-end",
          padding: "60px",
          background: "linear-gradient(135deg, #0A0A0A 0%, #1a1510 50%, #141414 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 16, color: "#C4A35A", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "20px" }}>
          AutoVault
        </div>
        <div
          style={{
            fontSize: facilityName.length > 40 ? 36 : 48,
            fontWeight: 300,
            color: "#F5F0EB",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {facilityName}
        </div>
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "#C4A35A",
            marginTop: "28px",
          }}
        />
        <div style={{ fontSize: 18, color: "#9A9590", marginTop: "16px" }}>
          Luxury Vehicle Storage · autovault.network
        </div>
      </div>
    ),
    { ...size }
  );
}
