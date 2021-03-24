import getPackage from "package";
import React from "react";
import ReactDOMServer from "react-dom/server";
import TestPage from "./pages/test-page/app";
import { renderStylesToString } from "@emotion/server";
import mkdirp from "mkdirp";
import fs from "fs";
import path from "path";

export default async function generateSite(): Promise<void> {
  const outputDir = "public";
  await mkdirp(outputDir);
  const mainPackage = getPackage(require.main);
  const logoPath = mainPackage.logo;
  const logoUrl = logoPath && `resources/logo${path.extname(logoPath)}`;
  if (logoPath) {
    const logoOutputPath = path.join(outputDir, logoUrl);
    await mkdirp(path.dirname(logoOutputPath));
    await fs.promises.copyFile(logoPath, logoOutputPath);
    console.log(`Copied logo file: ${logoOutputPath}`);
  }

  const readme = stripHeader(await fs.promises.readFile("README.md", "utf-8"));
  const appContent = ReactDOMServer.renderToString(
    <TestPage {...mainPackage} logo={logoUrl} readme={readme} />
  );
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="utf-8">
      <title>${mainPackage.name}</title>
      <script defer="true" type="application/javascript" src="script/bundles/test-page.js"></script>
  </head>
  <body style='margin: 0'><div id='app'>${appContent}</div></body>
</html>`;
  await fs.promises.writeFile(
    path.join(outputDir, "index.html"),
    html,
    "utf-8"
  );
  console.log("Generated page: public/index.html");
}

function stripHeader(contents) {
  const lines = contents.split(/\r?\n/);
  const idx = lines.findIndex(line => line.trim() === "---") + 1;
  return lines.slice(idx).join("\n");
}
