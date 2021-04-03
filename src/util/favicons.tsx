import Jimp from "jimp";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { Manifest } from "./manifest-types";
import { findBestIcon } from "./manifest";
import { ReactElement } from "react";
import { fileExists } from "./fs-extras";

/**
 * Uses a predetermined set of icon sizes and types to determine a preferred set of
 * icons to use for the page; generates those icons in the public directory from those provided
 * in the manifest, and returns an array of Link elements to describe them.
 */
export async function generateFavicons(
  projectRootDir: string,
  publicRootDir: string,
  manifest: Manifest
): Promise<Array<React.ReactElement>> {
  if (!manifest.icons || !manifest.icons.length) {
    return [];
  }

  const iconDefinitions: Array<[
    string,
    string,
    number,
    number,
    (t: string) => boolean,
    Array<string>
  ]> = [
    [
      "icon",
      "svg",
      128,
      128,
      allowSvgType,
      ["resources", "generated", "icon-svg"]
    ],
    [
      "icon",
      "icon-180",
      180,
      180,
      allowTypesForFavicon,
      ["resources", "generated", "icon-180"]
    ],
    [
      "icon",
      "icon-512",
      512,
      512,
      allowTypesForFavicon,
      ["resources", "generated", "icon-512"]
    ],
    ["icon", "favicon", 32, 32, allowTypesForFavicon, ["favicon.ico"]],
    [
      "apple-touch-icon",
      "apple-touch-icon",
      192,
      192,
      allowTypesForFavicon,
      ["resources", "generated", "icon-192"]
    ]
  ];

  const iconElements = await Promise.all(
    iconDefinitions.map(([rel, key, w, h, allowType, pathComponents]) =>
      generateIconLink(
        projectRootDir,
        manifest,
        publicRootDir,
        rel,
        key,
        w,
        h,
        allowType,
        pathComponents
      )
    )
  );

  return iconElements.filter(el => typeof el !== "undefined");
}

function allowSvgType(type: string): boolean {
  return type === "image/svg+xml";
}

function allowTypesForFavicon(type: string): boolean {
  switch (type) {
    case "image/png":
    case "image/gif":
    case "image/jpeg":
      return true;
  }
  return false;
}

export async function generateImage(
  projectRootDir: string,
  manifest: Manifest,
  publicRootDir: string,
  w: number,
  h: number,
  letterBox: boolean = false,
  allowType: (type: string) => boolean,
  pathComponents: Array<string>
): Promise<
  | { href: string; width: number; height: number; sizes: string; type: string }
  | undefined
> {
  const icon = findBestIcon(manifest, w, h, allowType);
  if (icon) {
    const lastComponent = pathComponents[pathComponents.length - 1];
    const fileName =
      path.basename(lastComponent, path.extname(lastComponent)) +
      (path.extname(lastComponent) || path.extname(icon.src));
    const relPath = [...pathComponents.slice(0, -1), fileName];
    const url = "/" + relPath.join("/");
    const outputPath = path.resolve(publicRootDir, ...relPath);
    const inputPath = path.resolve(projectRootDir, icon.src);
    if (await fileExists(outputPath)) {
      await fs.promises.chmod(outputPath, WRITEABLE);
    }
    await mkdirp(path.dirname(outputPath));
    let sizes;
    let dims;
    if (icon.type === "image/svg+xml") {
      await copyImage(inputPath, outputPath);
      sizes =
        "1x1 12x12 24x24 32x32 48x48 64x64 128x128 180x180 256x256 512x512 1024x1024 1048576x1048576 any";
      dims = [w, h];
    } else {
      const scale = letterBox
        ? (i: Jimp) => i.contain(w, h)
        : (i: Jimp) => i.scaleToFit(w, h);
      const scaledImg = await scale(await Jimp.read(inputPath)).writeAsync(
        outputPath
      );
      await fs.promises.chmod(outputPath, READ_ONLY);
      const width = scaledImg.getWidth();
      const height = scaledImg.getHeight();
      sizes = `${w}x${h}`;
      dims = [width, height];
    }
    console.log(`Generated image ${url} from ${icon.src}`);
    return {
      href: url,
      sizes,
      width: dims[0],
      height: dims[1],
      type: icon.type
    };
  }
}

/**
 * Find the best icon in the manifest for the given constraints, if one exists.
 * Copy and scale it to the output directory, and return a Link element to describe
 * it.
 */
async function generateIconLink(
  projectRootDir: string,
  manifest: Manifest,
  publicRootDir: string,
  rel: string,
  key: string,
  w: number,
  h: number,
  allowType: (type: string) => boolean,
  pathComponents: Array<string>
): Promise<ReactElement | undefined> {
  const icon = await generateImage(
    projectRootDir,
    manifest,
    publicRootDir,
    w,
    h,
    true,
    allowType,
    pathComponents
  );
  if (icon) {
    const { href, sizes, type } = icon;
    return <link {...{ rel, key, href, sizes, type }} />;
  }
}

async function copyImage(srcPath: string, outputPath: string): Promise<void> {
  await fs.promises.copyFile(srcPath, outputPath);
  await fs.promises.chmod(outputPath, READ_ONLY);
}

const READ_ONLY = 0o444;
const WRITEABLE = 0o644;
