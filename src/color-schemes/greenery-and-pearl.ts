import { Colorscheme } from "./_types";
/**
 * Credit: https://dribbble.com/shots/6542941-Cacti-Succulents-Store-Web-site-Concept, https://hookagency.com/website-color-schemes/
 */
const olive = "#A3BCB6";
const greenLeaf = "#39603D";
const brownGrey = "#3C403D";
const tanly = "#DADED4";
const white = "#FFFFFF";

export default {
  name: "Greenery and Pearl",
  light: {
    background: tanly,
    primary: brownGrey,
    accent: greenLeaf,
    fade: olive,
    highlight: white,
    highlightAccent: white,
    highlightContrast: brownGrey
  },
  dark: {
    background: brownGrey,
    primary: tanly,
    accent: white,
    fade: greenLeaf,
    highlight: white,
    highlightAccent: tanly,
    highlightContrast: brownGrey
  }
} as Colorscheme;
