import fs from "fs";

function stripHeader(contents: string): string {
  const lines = contents.split(/\r?\n/);
  const idx = lines.findIndex(line => line.trim() === "---") + 1;
  return lines.slice(idx).join("\n");
}

export async function readMarkdownFile(p: string): Promise<string> {
  return stripHeader(await fs.promises.readFile(p, "utf-8"));
}
