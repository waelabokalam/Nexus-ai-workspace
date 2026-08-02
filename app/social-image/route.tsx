import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#09090b",
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
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "999px", height: "420px", position: "absolute", right: "-120px", top: "-170px", width: "420px" }} />
        <div style={{ alignItems: "center", display: "flex", fontSize: 30, fontWeight: 600, gap: 16, letterSpacing: "-0.03em" }}>
          <div style={{ alignItems: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "999px", display: "flex", fontSize: 28, height: 48, justifyContent: "center", width: 48 }}>N</div>
          Nexus
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}>
          <div style={{ color: "#a1a1aa", fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase" }}>Business communication</div>
          <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 1.02, marginTop: 24 }}>AI operating system for business communication.</div>
          <div style={{ color: "#a1a1aa", fontSize: 28, lineHeight: 1.4, marginTop: 26 }}>Adaptive responses, business knowledge, memory, workflows and visible execution.</div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.13)", color: "#a1a1aa", display: "flex", fontSize: 20, justifyContent: "space-between", paddingTop: 22 }}>
          <span>English · Arabic · Turkish</span>
          <span>Early access</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
