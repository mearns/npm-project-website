import Jimp from "jimp";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

export async function generateFavicons(
  projectRootDir: string,
  icons: Array<string>,
  publicRootDir: string
): Promise<Array<React.ReactElement>> {
  if (!icons || !icons.length) {
    return;
  }

  const srcImages = await Promise.all(
    icons.map(async p => ({
      file: p,
      img: await Jimp.read(path.resolve(projectRootDir, p))
    }))
  );

  const [favicon32, appleTouchIcon, icon192, icon512] = await Promise.all([
    generateImage(srcImages, publicRootDir, 32, 32, ["favicon.ico"]),
    generateImage(srcImages, publicRootDir, 180, 180, [
      "resources",
      "icon-180.png"
    ]),
    generateImage(srcImages, publicRootDir, 192, 192, [
      "resources",
      "icon-192.png"
    ]),
    generateImage(srcImages, publicRootDir, 512, 512, [
      "resources",
      "icon-512.png"
    ])
  ]);

  const manifest = {
    icons: [
      { src: icon192, type: "image.png", sizes: "192x192" },
      { src: icon512, type: "image.png", sizes: "512x512" }
    ]
  };

  await mkdirp(publicRootDir);
  await fs.promises.writeFile(
    path.resolve(publicRootDir, "manifest.webmanifest"),
    JSON.stringify(manifest),
    "utf-8"
  );

  return [
    <link
      key="32"
      rel="icon"
      href={favicon32}
      sizes="32x32"
      type="image/png"
    />,
    <link
      key="192"
      rel="icon"
      href={icon192}
      sizes="192x192"
      type="image/png"
    />,
    <link
      key="512"
      rel="icon"
      href={icon512}
      sizes="512x512"
      type="image/png"
    />,
    <link
      key="apply-touch-icon"
      rel="apple-touch-icon"
      href={appleTouchIcon}
      sizes="180x180"
      type="image/png"
    />,
    <link
      key="manifest"
      rel="manifest"
      href="/manifest.webmanifest"
      type="application/json"
    />
  ];
}

async function generateImage(
  allImages: Array<{ img: Jimp; file: string }>,
  publicRootDir: string,
  w: number,
  h: number,
  pathComponents: Array<string>
) {
  const scaleData = allImages.map(({ img }, idx) => {
    return {
      ...findScale(w, h, img.bitmap.width, img.bitmap.height),
      idx
    };
  });
  const { idx: bestFitIdx } = scaleData.reduce((best, current) => {
    if (current.score > best.score) {
      return current;
    }
    return best;
  });
  const bestImg = allImages[bestFitIdx];
  const imgBuffer: Buffer = await (await Jimp.read(bestImg.img))
    .contain(w, h)
    .getBufferAsync(Jimp.MIME_PNG);

  const urlPath = `/${pathComponents.join("/")}`;
  const outputPath = path.resolve(publicRootDir, ...pathComponents);
  await mkdirp(path.dirname(outputPath));
  await fs.promises.writeFile(outputPath, imgBuffer);
  console.log(`Generated icon ${urlPath} from ${bestImg.file}`);
  return urlPath;
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
