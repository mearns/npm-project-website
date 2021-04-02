import fs from "fs";
import { fileExists } from "./fs-extras";
import path from "path";

export interface Package {
  name: string;
  version: string;
  logo?: string;
  icons?: Array<
    | string
    | {
        src: string;
        type?: string;
        sizes?: "any" | Array<string>;
        purpose?: Array<"maskable" | "monochrome" | "any">;
      }
  >;
  repository?: {
    type: string;
    url: string;
  };
  author?: string;
  license?: string;
  bugs?: {
    url: string;
  };
  homepage?: string;
}

/**
 * Finds the root directory of the current main package. Starting at the path
 * of the main module, looks for a package.json file and moves up the directory
 * system until it finds one.
 *
 * @returns The path to the root of the current main package.
 * @throws Throws an error if no root directory could be found.
 */
export async function findPackageRoot(): Promise<string> {
  const mainDir = require.main.path;
  let dir = mainDir;
  do {
    const testPath = path.resolve(dir, "package.json");
    if (await fileExists(testPath)) {
      return dir;
    }
    dir = path.dirname(dir);
  } while (path.dirname(dir) !== dir);
  throw new Error(
    `Could not find a package.json at or above the level of ${mainDir}`
  );
}

export async function getPackage(rootDir: string): Promise<Package> {
  const p = path.resolve(rootDir, "package.json");
  const packageData: unknown = await readJsonFile(p);
  if (typeof packageData !== "object") {
    throw new TypeError("The contents of package.json are not a JSON object");
  }
  return packageData as Package;
}

async function readJsonFile(p: string): Promise<unknown> {
  const contents = await fs.promises.readFile(p, "utf-8");
  return JSON.parse(contents);
}
