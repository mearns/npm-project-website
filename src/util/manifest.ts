import fs from "fs";
import { Package } from "./package";
import * as FileType from "file-type";
import xmljs from "xml-js";
import path from "path";
import Jimp from "jimp";

export interface Icon {
  src: string;
  type: string;
  sizes: "any" | Array<[number, number]>;
  purpose: Array<"monochrome" | "maskable" | "any">;
}

export interface Manifest {
  icons?: Array<Icon>;
}

export async function loadProjectManifest(
  projectRootDir: string,
  mainPackage: Package
): Promise<Manifest> {
  const manifest: Manifest = {};

  manifest.icons = await Promise.all(
    mainPackage.icons?.map(async iconDecl => {
      const relSrc = typeof iconDecl === "string" ? iconDecl : iconDecl.src;
      if (!relSrc) {
        throw new Error(
          `Unexpected icon declaration in package: src is undefined: ${iconDecl}`
        );
      }
      const src = path.resolve(projectRootDir, relSrc);
      const type =
        typeof iconDecl === "string" || !iconDecl.type
          ? await detectMimeType(src)
          : iconDecl.type;
      let sizes;
      if (type === "image/svg+xml") {
        sizes = "any";
      } else {
        const img = await Jimp.read(src);
        sizes = [[img.getWidth(), img.getHeight()]];
      }

      const purpose =
        typeof iconDecl === "string" || !iconDecl.purpose
          ? (["any"] as Array<"any">)
          : (iconDecl.purpose.filter(
              p => p === "maskable" || p === "any" || p === "monochrome"
            ) as Array<"maskable" | "any" | "monochrome">);

      return { src, type, sizes, purpose };
    })
  );

  return manifest;
}

async function detectMimeType(p: fs.PathLike): Promise<string> {
  const buffer = await fs.promises.readFile(p);
  const fileType = await FileType.fromBuffer(buffer);
  if (typeof fileType !== "undefined") {
    return fileType.mime;
  }

  const text = buffer.toString("utf-8");
  try {
    const xml = xmljs.xml2js(text);
    if (xml.elements && xml.elements.length && xml.elements[0].name === "svg") {
      return "image/svg+xml";
    }
    throw Object.assign(
      new Error(
        `Unknown XML image format for file, expected SVG as the root element: ${p}`
      ),
      { filePath: p }
    );
  } catch (_) {
    // Not XML
  }

  throw Object.assign(
    new Error(
      `Unknown image format for file, expected PNG, JPEG, GIF, or SVG: ${p}`
    ),
    { filePath: p }
  );
}

export function findBestIcon(
  manifest: Manifest,
  w: number,
  h: number,
  allowType = (() => true) as (type: string) => boolean
): Icon | undefined {
  const usableIcons = (manifest.icons || []).filter(icon =>
    allowType(icon.type)
  );
  const availableSizes = usableIcons.reduce(
    (
      allSizes: Array<{ size: [number, number] | "any"; iconIdx: number }>,
      icon: Icon,
      iconIdx
    ) => {
      if (icon.sizes === "any") {
        allSizes.push({ size: "any", iconIdx });
      } else {
        allSizes.push(...icon.sizes.map(size => ({ size, iconIdx })));
      }
      return allSizes;
    },
    []
  );

  if (availableSizes.length === 0) {
    return;
  }

  const firstAny = availableSizes.find(s => s.size === "any");
  if (firstAny) {
    return usableIcons[firstAny.iconIdx];
  }

  const scaleData = (availableSizes as Array<{
    size: [number, number];
    iconIdx: number;
  }>).map(({ size, iconIdx }) => {
    return {
      ...findScale(w, h, size[0], size[1]),
      size,
      iconIdx
    };
  });
  const { iconIdx: bestFitIdx } = scaleData.reduce((best, current) => {
    if (current.score > best.score) {
      return current;
    }
    return best;
  });
  return usableIcons[bestFitIdx];
}

function findScale(
  dw: number,
  dh: number,
  w: number,
  h: number
): { scale: number; score: number } {
  const scale = Math.min(dw / w, dh / h);
  const scaleScore = scale > 1 ? 1 / scale : scale;
  const filledArea = w * scale * h * scale;
  const fill = filledArea / (dw * dh);
  return { scale, score: scaleScore * fill };
}
