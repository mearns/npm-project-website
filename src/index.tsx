import { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import Homepage from "./pages/homepage/app";
import mkdirp from "mkdirp";
import fs from "fs";
import path from "path";
import { findPackageRoot, getPackage, Package } from "./util/package";
import { readMarkdownFile } from "./util/markdown";
import { fileExists, ifFileExists } from "./util/fs-extras";
import SiteData, { SiteComponent } from "./util/site-data";
import { generateFavicons } from "./util/favicons";
import { loadProjectManifest, Manifest } from "./util/manifest";

export default async function generateSite(): Promise<void> {
  const outputDir = "public";
  const rootDir = await findPackageRoot();
  const outputPath = path.resolve(rootDir, "public");

  const [mainPackage]: [Package, void] = await Promise.all([
    await getPackage(rootDir),
    mkdirp(outputPath)
  ]);

  const manifest = await loadProjectManifest(rootDir, mainPackage);

  const [logoUrl, readme, faviconTags]: [
    string,
    string,
    Array<ReactElement>
  ] = await Promise.all([
    publishLogo(rootDir, mainPackage, outputDir),
    getReadmeContent(rootDir),
    generateFavicons(rootDir, outputDir, manifest)
  ]);

  const siteData: SiteData = {
    name: mainPackage.name,
    version: mainPackage.version,
    repositoryUrl: mainPackage.repository?.url,
    logoUrl: logoUrl,
    readme: readme
  };

  const html = await renderPage("homepage", siteData, Homepage, faviconTags);

  const indexFile = path.join(outputDir, "index.html");
  if (await fileExists(indexFile)) {
    await fs.promises.chmod(indexFile, WRITEABLE);
  }
  await mkdirp(path.dirname(indexFile));
  await fs.promises.writeFile(indexFile, html, {
    encoding: "utf-8",
    mode: READ_ONLY
  });
  console.log("Generated page: public/index.html");
}

async function renderPage(
  pageName: string,
  siteData: SiteData,
  Component: SiteComponent,
  faviconTags: Array<ReactElement>
): Promise<string> {
  const Page = () => (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{siteData.name}</title>
        {...faviconTags}
        <script
          defer={true}
          type="application/javascript"
          src={`script/bundles/${pageName}.js`}
        ></script>
      </head>

      <body style={{ margin: 0 }}>
        <div id="app">
          <Component {...siteData} />
        </div>

        <script type="text/json" id="app-properties">
          {JSON.stringify(siteData)}
        </script>
      </body>
    </html>
  );

  return ReactDOMServer.renderToString(<Page />);
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

const READ_ONLY = 0o444;
const WRITEABLE = 0o644;

/**
 * @param rootDir The root directory of the project
 * @param mainPackage The package data for the project (i.e., from package.json).
 * @param outputDir The path to the output directory, we assume this is the root of the website.
 * @returns The relative URL to the logo.
 */
async function publishLogo(
  rootDir: string,
  mainPackage: Package,
  outputDir: string
): Promise<string> {
  const logoPath = path.resolve(rootDir, mainPackage.logo);
  const logoUrl = logoPath && `resources/logo${path.extname(logoPath)}`;
  if (logoPath) {
    if (!(await fileExists(logoPath))) {
      throw new Error(`Specified logo file doesn't exist: ${logoPath}`);
    }
    const logoOutputPath = path.join(outputDir, logoUrl);
    if (await fileExists(logoOutputPath)) {
      await fs.promises.chmod(logoOutputPath, WRITEABLE);
    }
    await mkdirp(path.dirname(logoOutputPath));
    await fs.promises.copyFile(logoPath, logoOutputPath);
    await fs.promises.chmod(logoOutputPath, READ_ONLY);
    console.log(`Copied logo file: ${logoOutputPath}`);
  }
  return logoUrl;
}
