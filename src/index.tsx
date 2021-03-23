import getPackage from "package";
import React from 'react';
import ReactDOMServer from "react-dom/server";
import Homepage from "./components/homepage";
import { renderStylesToString } from '@emotion/server'
import mkdirp from "mkdirp";
import fs from 'fs';
import path from 'path';

export default async function generateSite(): Promise<void> {
  const outputDir = "./public";
  await mkdirp(outputDir);
  const mainPackage = getPackage(require.main);
  const logoPath = mainPackage.logo;
  const logoUrl = logoPath && `resources/logo.${path.extname(logoPath)}`;
  if (logoPath) {
    const logoOutputPath = path.join(outputDir, logoUrl);
    await mkdirp(path.dirname(logoOutputPath))
    await fs.promises.copyFile(logoPath, logoOutputPath);
  }

  const readme = stripHeader(await fs.promises.readFile("README.md", "utf-8"));
  const html = renderStylesToString(ReactDOMServer.renderToString(<Homepage {...mainPackage} logo={logoUrl} readme={readme} />));
  await fs.promises.writeFile(path.join(outputDir, "index.html"), html, "utf-8");
}

function stripHeader(contents) {
  const lines = contents.split(/\r?\n/);
  const idx = lines.findIndex(line => line.trim() === "---") + 1;
  return lines.slice(idx).join("\n");
}