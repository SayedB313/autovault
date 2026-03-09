import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AutoVault Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 20, color: "#60a5fa", fontWeight: 600, marginBottom: "16px" }}>
          AutoVault Blog
        </div>
        <div
          style={{
            fontSize: title.length > 60 ? 36 : 48,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 18, color: "#94a3b8", marginTop: "24px" }}>
          autovault.network
        </div>
      </div>
    ),
    { ...size }
  );
}
