import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export async function GET() {
  const icon = await readFile(join(process.cwd(), "public", "tqen-icon-tight.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#090A0C",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ background: "rgba(0,82,255,0.14)", borderRadius: "999px", height: "420px", position: "absolute", right: "-120px", top: "-170px", width: "420px" }} />
        <div style={{ alignItems: "center", display: "flex", fontSize: 30, fontWeight: 700, gap: 16, letterSpacing: "-0.03em" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="TQEN" height={48} src={iconSrc} style={{ borderRadius: "10px" }} width={48} />
          TQEN
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}>
          <div style={{ color: "#a1a1aa", fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase" }}>Intelligent systems for real business operations</div>
          <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 1.02, marginTop: 24 }}>Intelligent systems built around your operation.</div>
          <div style={{ color: "#a1a1aa", fontSize: 28, lineHeight: 1.4, marginTop: 26 }}>Software, automation and AI that handle repetitive work and surface the decisions that matter.</div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.13)", color: "#a1a1aa", display: "flex", fontSize: 20, justifyContent: "space-between", paddingTop: 22 }}>
          <span>Industry systems · Custom systems</span>
          <span>Restaurant pilot ready</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
