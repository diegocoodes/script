import type { jsPDF } from "jspdf";

const DEFAULT_LOGO_URL = "/logo.png";
const logoCache = new Map<string, Promise<Uint8Array>>();

type LogoPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadLogo(source: string) {
  const cachedLogo = logoCache.get(source);
  if (cachedLogo) {
    return cachedLogo;
  }

  const pendingLogo = fetch(source, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Não foi possível carregar a logo (${response.status}).`);
      }

      return response.arrayBuffer();
    })
    .then((buffer) => new Uint8Array(buffer));

  logoCache.set(source, pendingLogo);
  return pendingLogo;
}

export async function addCompanyLogo(
  document: jsPDF,
  logoUrl: string | null | undefined,
  placement: LogoPlacement,
) {
  const sources = [...new Set([logoUrl, DEFAULT_LOGO_URL].filter(Boolean))] as string[];

  for (const source of sources) {
    try {
      const imageData = await loadLogo(source);
      const image = document.getImageProperties(imageData);
      const scale = Math.min(
        placement.width / image.width,
        placement.height / image.height,
      );
      const width = image.width * scale;
      const height = image.height * scale;

      document.addImage({
        imageData,
        format: image.fileType,
        x: placement.x + (placement.width - width) / 2,
        y: placement.y + (placement.height - height) / 2,
        width,
        height,
        alias: "company-logo",
        compression: "FAST",
      });

      return true;
    } catch {
      // Se a logo configurada falhar, tenta a logo local antes do monograma.
    }
  }

  return false;
}
