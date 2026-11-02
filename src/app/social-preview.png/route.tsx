import { ImageResponse } from "next/og";
import { getCompany } from "@/content/company";

const size = { width: 1200, height: 630 };
export const dynamic = "force-static";

export async function GET() {
  const company = await getCompany();
  const lines = [180, 300, 420];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#14283f", color: "#ffffff", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {lines.map((y, i) => (
            <path key={y} d={`M500 ${y} C 700 ${y - 40}, 850 ${y + 60}, 1200 ${y + 10 * i}`} stroke="#f28c4f" strokeOpacity={0.7 - i * 0.15} strokeWidth="4" fill="none" />
          ))}
          <circle cx="1010" cy="160" r="110" stroke="#c9d3df" strokeOpacity="0.4" strokeWidth="3" fill="none" />
          <circle cx="1010" cy="160" r="84" stroke="#c9d3df" strokeOpacity="0.25" strokeWidth="3" fill="none" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 44, fontWeight: 800, letterSpacing: 8 }}>
          {company.brand.name.toUpperCase()}
          <div style={{ width: 16, height: 16, borderRadius: 999, background: "#f28c4f", display: "flex" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.08 }}>{`Ventilación y climatización en ${company.location.city}.`}</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#c9d3df" }}>Servicios y empleo en el sector de la climatización</div>
        </div>
      </div>
    ),
    size,
  );
}
