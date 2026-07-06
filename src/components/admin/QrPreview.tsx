"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildCompanyUrl,
  downloadDataUrl,
  downloadSvg,
  drawQrWithLogoOnCanvas,
  generateQrSvgWithLogo,
} from "@/lib/qrcode";
import type { Company } from "@/lib/types";

export default function QrPreview({ company }: { company: Company }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const url = buildCompanyUrl(company.slug);
  const themeColor = company.theme_color || "#000000";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    drawQrWithLogoOnCanvas(canvas, url, company.logo_url, themeColor)
      .then(() => {
        if (!cancelled) setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to generate QR");
      });

    return () => {
      cancelled = true;
    };
  }, [url, company.logo_url, themeColor]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    downloadDataUrl(canvas.toDataURL("image/png"), `${company.slug}-qr.png`);
  };

  const handleDownloadSvg = async () => {
    try {
      const svg = await generateQrSvgWithLogo(url, company.logo_url, themeColor);
      downloadSvg(svg, `${company.slug}-qr.svg`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate SVG");
    }
  };

  return (
    <div
      className="rounded-[var(--radius-card)] border p-5"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">QR code</h3>
          <p className="mt-1 break-all text-xs" style={{ color: "var(--color-muted)" }}>
            {url}
          </p>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="rounded-[var(--radius-control)] border px-3 py-2 text-sm font-medium cursor-pointer"
              style={{ borderColor: "var(--color-border)" }}
            >
              Download PNG
            </button>
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="rounded-[var(--radius-control)] border px-3 py-2 text-sm font-medium cursor-pointer"
              style={{ borderColor: "var(--color-border)" }}
            >
              Download SVG
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="rounded-xl border bg-white"
          style={{ width: "200px", height: "200px", borderColor: "var(--color-border)" }}
        />
      </div>
    </div>
  );
}
