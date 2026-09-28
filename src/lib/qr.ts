import QRCode from "qrcode";

/**
 * QR como SVG inline, generado en el servidor (qrcode no llega al bundle del navegador).
 * El trazo queda en `currentColor` y sin fondo propio: el color y el margen de silencio los pone
 * el contenedor con los tokens de la marca.
 */
export async function buildQrSvg(texto: string): Promise<string> {
  const svg = await QRCode.toString(texto, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
  });
  return svg
    .replace(/<path fill="#ffffff"[^>]*\/>/i, "")
    .replace(/stroke="#000000"/i, 'stroke="currentColor"');
}
