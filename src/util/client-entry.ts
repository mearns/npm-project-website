import { hydrate } from "react-dom";
import SiteData, { SiteComponent } from "./site-data";
import { decode } from "html-entities";

export default function clientHandoff(App: SiteComponent): void {
  window.addEventListener("DOMContentLoaded", () => {
    const appProps = getApplicationProperties();
    hydrate(App(appProps), document.querySelector("#app"));
  });
}

function getApplicationProperties(): SiteData {
  try {
    const propsEle = document.getElementById("app-properties");
    if (!propsEle) {
      throw new Error("Could not find #app-properties");
    }
    return JSON.parse(
      decode(propsEle.textContent)
        .replace(/\\\//g, "/")
        .replace(/\\\\/g, "\\")
    ) as SiteData;
  } catch (error) {
    throw new Error(
      `Failed to load application properties: client-side rendering cannot take over: ${error.message}`
    );
  }
}
