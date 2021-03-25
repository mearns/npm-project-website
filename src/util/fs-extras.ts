import fs from "fs";

export async function fileExists(p: fs.PathLike): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(p);
    return stats.isFile();
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

/**
 * @param p The path
 * @param ifExists The function to call if the path exists
 * @param ifNotExists The function to call if the file doesn't exist.
 * @returns The value returned by whichever function was called, or undefined if the function wasn't given.
 */
export async function ifFileExists<T>(
  p: fs.PathLike,
  ifExists?: (p: fs.PathLike) => T | Promise<T>,
  ifNotExists?: (p: fs.PathLike) => T | Promise<T>
): Promise<T | undefined> {
  if (await fileExists(p)) {
    if (ifExists) {
      const r = await ifExists(p);
      return r;
    }
    return;
  }
  if (ifNotExists) {
    const r = await ifNotExists(p);
    return r;
  }
}
