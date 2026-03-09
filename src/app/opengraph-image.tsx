import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AutoVault - The Premier Luxury Vehicle Storage Directory";
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
          background: "linear-gradient(135deg, #0A0A0A 0%, #1a1510 50%, #141414 100%)",
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
              fontSize: 28,
              fontWeight: 600,
              color: "#C4A35A",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
            }}
          >
            AutoVault
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 300,
              color: "#F5F0EB",
              letterSpacing: "-1px",
              marginTop: "8px",
            }}
          >
            Luxury Vehicle Storage
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#9A9590",
              fontWeight: 400,
              marginTop: "4px",
            }}
          >
            The Premier Directory for Exotic & Collector Cars
          </div>
          <div
            style={{
              width: "60px",
              height: "1px",
              background: "#C4A35A",
              marginTop: "24px",
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: "#9A9590",
              marginTop: "16px",
            }}
          >
            405+ Facilities · Climate-Controlled · Concierge-Level
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
