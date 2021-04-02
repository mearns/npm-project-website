import Jimp from "jimp";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { findBestIcon, Icon, Manifest } from "./manifest";
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
      ["resources", "generated", "icon.svg"]
    ],
    [
      "icon",
      "icon-180",
      180,
      180,
      allowTypesForFavicon,
      ["resources", "generated", "icon-180.png"]
    ],
    [
      "icon",
      "icon-512",
      512,
      512,
      allowTypesForFavicon,
      ["resources", "generated", "icon-512.png"]
    ],
    ["icon", "favicon", 32, 32, allowTypesForFavicon, ["favicon.ico"]],
    [
      "apple-touch-icon",
      "apple-touch-icon",
      192,
      192,
      allowTypesForFavicon,
      ["resources", "generated", "icon-192.png"]
    ]
  ];

  const iconElements = await Promise.all(
    iconDefinitions.map(i =>
      generateImage(projectRootDir, manifest, publicRootDir, ...i)
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

/**
 * Find the best icon in the manifest for the given constraints, if one exists.
 * Copy and scale it to the output directory, and return a Link element to describe
 * it.
 */
async function generateImage(
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
  const icon = findBestIcon(manifest, w, h, allowType);
  if (icon) {
    const url = "/" + pathComponents.join("/");
    const outputPath = path.resolve(publicRootDir, ...pathComponents);
    const inputPath = path.resolve(projectRootDir, icon.src);
    if (await fileExists(outputPath)) {
      await fs.promises.chmod(outputPath, WRITEABLE);
    }
    await mkdirp(path.dirname(outputPath));
    let sizes;
    if (icon.type === "image/svg+xml") {
      await copyImage(inputPath, outputPath);
      sizes =
        "1x1 12x12 24x24 32x32 48x48 64x64 128x128 180x180 256x256 512x512 1024x1024 1048576x1048576 any";
    } else {
      await (await Jimp.read(inputPath))
        .scaleToFit(w, h)
        .writeAsync(outputPath);
      await fs.promises.chmod(outputPath, READ_ONLY);
      sizes = `${w}x${h}`;
    }
    console.log(`Generated icon ${url} from ${icon.src}`);
    return (
      <link rel={rel} key={key} href={url} sizes={sizes} type={icon.type} />
    );
  }
}

async function copyImage(srcPath: string, outputPath: string): Promise<void> {
  await fs.promises.copyFile(srcPath, outputPath);
  await fs.promises.chmod(outputPath, READ_ONLY);
}

const READ_ONLY = 0o444;
const WRITEABLE = 0o644;
