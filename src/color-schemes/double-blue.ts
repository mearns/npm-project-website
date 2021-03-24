import { Colorscheme } from "./_types";
/**
 * Credit: https://hookagency.com/website-color-schemes/
 */
const darkBlue = "#12232E";
const medBlue = "#0d4b73";
const lighterBlue = "#007CC7";
const lightestBlue = "#4DA8DA";
const shadowOfDarkBlue = "#203647";
const shadowOfLightBlue = "#EEFBFB";

export default {
  name: "Classic Double Blue",
  light: {
    background: shadowOfLightBlue,
    primary: shadowOfDarkBlue,
    accent: darkBlue,
    fade: lightestBlue,
    highlight: lighterBlue,
    highlightAccent: lightestBlue,
    highlightContrast: shadowOfLightBlue
  },
  dark: {
    background: darkBlue,
    primary: shadowOfLightBlue,
    accent: lightestBlue,
    fade: medBlue,
    highlight: lighterBlue,
    highlightAccent: lightestBlue,
    highlightContrast: shadowOfLightBlue
  }
} as Colorscheme;
