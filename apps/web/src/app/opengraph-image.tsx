import { ImageResponse } from "next/og";
import { content } from "@/content/site";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { profile } = content;
  const host = new URL(siteConfig.url).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0c0c0e",
          color: "#fafaf9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#5eead4", letterSpacing: 2 }}>
          {"</>"}&nbsp;&nbsp;{profile.role.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
          <div style={{ fontSize: 36, color: "#a1a1aa", maxWidth: 940, lineHeight: 1.35 }}>
            {profile.tagline}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#71717a" }}>{host}</div>
      </div>
    ),
    size,
  );
}
