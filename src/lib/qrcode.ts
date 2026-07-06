import QRCode from "qrcode";

const DEFAULT_LOGO_RATIO = 0.2;

export function buildCompanyUrl(slug: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://yoursite.com").replace(/\/$/, "");
  return `${base}/${slug}`;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function toDataUri(src: string): Promise<string> {
  if (src.startsWith("data:")) return src;
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export interface QrLogoOptions {
  size?: number;
  logoRatio?: number;
  margin?: number;
}

export async function drawQrWithLogoOnCanvas(
  canvas: HTMLCanvasElement,
  url: string,
  logoSrc: string | null,
  themeColor: string,
  options: QrLogoOptions = {}
): Promise<void> {
  const { size = 900, logoRatio = DEFAULT_LOGO_RATIO, margin = 2 } = options;

  canvas.width = size;
  canvas.height = size;

  await QRCode.toCanvas(canvas, url, {
    errorCorrectionLevel: "H",
    margin,
    width: size,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  if (!logoSrc) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const logo = await loadImage(logoSrc);

  const plateSize = size * logoRatio * 1.25;
  const logoSize = size * logoRatio;
  const plateX = size / 2 - plateSize / 2;
  const plateY = size / 2 - plateSize / 2;

  roundRectPath(ctx, plateX, plateY, plateSize, plateSize, plateSize * 0.2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.lineWidth = plateSize * 0.04;
  ctx.strokeStyle = themeColor;
  ctx.stroke();

  ctx.drawImage(logo, size / 2 - logoSize / 2, size / 2 - logoSize / 2, logoSize, logoSize);
}

export async function generateQrPngDataUrl(
  url: string,
  logoSrc: string | null,
  themeColor: string,
  options: QrLogoOptions = {}
): Promise<string> {
  const canvas = document.createElement("canvas");
  await drawQrWithLogoOnCanvas(canvas, url, logoSrc, themeColor, options);
  return canvas.toDataURL("image/png");
}

export async function generateQrSvgWithLogo(
  url: string,
  logoSrc: string | null,
  themeColor: string,
  options: { margin?: number; logoRatio?: number } = {}
): Promise<string> {
  const { margin = 2, logoRatio = DEFAULT_LOGO_RATIO } = options;

  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin,
  });

  if (!logoSrc) return svg;

  const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const size = viewBoxMatch ? Number(viewBoxMatch[1]) : 100;

  const plateSize = size * logoRatio * 1.25;
  const logoSize = size * logoRatio;
  const center = size / 2;
  const logoDataUri = await toDataUri(logoSrc);

  const overlay =
    `<rect x="${center - plateSize / 2}" y="${center - plateSize / 2}" ` +
    `width="${plateSize}" height="${plateSize}" rx="${plateSize * 0.2}" ` +
    `fill="#FFFFFF" stroke="${themeColor}" stroke-width="${plateSize * 0.04}"/>` +
    `<image x="${center - logoSize / 2}" y="${center - logoSize / 2}" ` +
    `width="${logoSize}" height="${logoSize}" href="${logoDataUri}"/>`;

  return svg.replace("</svg>", `${overlay}</svg>`);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
