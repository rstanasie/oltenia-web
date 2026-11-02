import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#14283f", position: "relative" }}>
        <div style={{ width: 96, height: 96, borderRadius: 999, border: "20px solid #ffffff", display: "flex" }} />
        <div style={{ position: "absolute", right: 34, bottom: 34, width: 26, height: 26, borderRadius: 999, background: "#f28c4f", display: "flex" }} />
      </div>
    ),
    size,
  );
}
