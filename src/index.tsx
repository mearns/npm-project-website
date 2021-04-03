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
import { generateFavicons, generateImage } from "./util/favicons";
import { findBestIcon, loadProjectManifest } from "./util/manifest";
import { Icon, Manifest } from "./util/manifest-types";

export default async function generateSite(): Promise<void> {
  const outputDir = "public";
  const rootDir = await findPackageRoot();
  const outputPath = path.resolve(rootDir, "public");

  const [mainPackage]: [Package, void] = await Promise.all([
    await getPackage(rootDir),
    mkdirp(outputPath)
  ]);

  const manifest = await loadProjectManifest(rootDir, mainPackage);

  const [logoIcon, readme, faviconTags]: [
    (
      | {
          href: string;
          width: number;
          height: number;
          type: string;
        }
      | undefined
    ),
    string,
    Array<ReactElement>
  ] = await Promise.all([
    publishLogo(rootDir, manifest, outputDir),
    getReadmeContent(rootDir),
    generateFavicons(rootDir, outputDir, manifest)
  ]);

  const siteData: SiteData = {
    name: mainPackage.name,
    version: mainPackage.version,
    repositoryUrl: mainPackage.repository?.url,
    readme: readme,
    logoIcon
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
  manifest: Manifest,
  outputDir: string
): Promise<
  | { href: string; width: number; height: number; sizes: string; type: string }
  | undefined
> {
  return generateImage(
    rootDir,
    manifest,
    outputDir,
    600,
    600,
    false,
    () => true,
    ["resources", "generated", "main-logo"]
  );
}
