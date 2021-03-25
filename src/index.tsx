import React from "react";
import ReactDOMServer from "react-dom/server";
import Homepage from "./pages/homepage/app";
import mkdirp from "mkdirp";
import fs from "fs";
import path from "path";
import { findPackageRoot, getPackage, Package } from "./util/package";
import { readMarkdownFile } from "./util/markdown";
import { ifFileExists } from "./util/fs-extras";
import SiteData, { SiteComponent } from "./util/site-data";
import handlebars from "handlebars";

export default async function generateSite({
  siteTemplateFile = path.resolve(
    __dirname,
    "../resources/page-template.html.hbs"
  )
} = {}): Promise<void> {
  const outputDir = "public";
  const rootDir = await findPackageRoot();
  const outputPath = path.resolve(rootDir, "public");

  const [mainPackage]: [Package, void] = await Promise.all([
    await getPackage(rootDir),
    mkdirp(outputPath)
  ]);

  const [logoUrl, readme]: [string, string] = await Promise.all([
    publishLogo(mainPackage, outputDir),
    getReadmeContent(rootDir)
  ]);

  const siteData: SiteData = {
    name: mainPackage.name,
    version: mainPackage.version,
    repositoryUrl: mainPackage.repository?.url,
    logoUrl: logoUrl,
    readme: readme
  };

  const html = await renderPageTemplate(
    "homepage",
    siteTemplateFile,
    siteData,
    Homepage
  );

  await fs.promises.writeFile(
    path.join(outputDir, "index.html"),
    html,
    "utf-8"
  );
  console.log("Generated page: public/index.html");
}

async function renderPageTemplate(
  pageName: string,
  templateFile: string,
  siteData: SiteData,
  component: SiteComponent
): Promise<string> {
  const encodedAppProperties = JSON.stringify(siteData)
    .replace(/\\/g, "\\\\")
    .replace(/\//g, "\\/");
  const appContent = ReactDOMServer.renderToString(component(siteData));
  const templateContent = await fs.promises.readFile(templateFile, "utf-8");
  return handlebars.compile(templateContent)({
    appContent,
    title: siteData.name,
    logoUrl: siteData.logoUrl,
    script: `script/bundles/${pageName}.js`,
    encodedAppProperties
  });
}

/**
 * Get the raw contents of the README file if it exists, or null otherwise.
 */
async function getReadmeContent(rootDir: string): Promise<string | null> {
  return ifFileExists(
    path.resolve(rootDir, "README.md"),
    readMarkdownFile,
    () => null
  );
}

async function publishLogo(mainPackage: Package, outputDir: string) {
  const logoPath = mainPackage.logo;
  const logoUrl = logoPath && `resources/logo${path.extname(logoPath)}`;
  if (logoPath) {
    const logoOutputPath = path.join(outputDir, logoUrl);
    await mkdirp(path.dirname(logoOutputPath));
    await fs.promises.copyFile(logoPath, logoOutputPath);
    console.log(`Copied logo file: ${logoOutputPath}`);
  }
  return logoUrl;
}
