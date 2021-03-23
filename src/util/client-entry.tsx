import React from "react";
import { hydrate } from "react-dom";

export default function clientHandoff(App) {
  window.addEventListener("DOMContentLoaded", () => {
    hydrate(<App />, document.querySelector("#app"));
  });
}
