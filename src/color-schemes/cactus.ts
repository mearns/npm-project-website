import { Colorscheme } from "./_types";
/**
 * Credit: https://dribbble.com/shots/6542941-Cacti-Succulents-Store-Web-site-Concept, https://hookagency.com/website-color-schemes/
 */
const realDarkGreen = "#0c2723";
const darkGreen = "#164A41";
const mediumGreen = "#4D774E";
const lightGreen = "#9DC88D";
const barelyGreen = "#e4f0e0";
const naturalYellow = "#F1B24A";
const white = "#FFFFFF";

export default {
  name: "Cactus",
  light: {
    background: white,
    primary: darkGreen,
    accent: mediumGreen,
    fade: lightGreen,
    highlight: naturalYellow,
    highlightAccent: naturalYellow,
    highlightContrast: white
  },
  dark: {
    background: realDarkGreen,
    primary: barelyGreen,
    accent: lightGreen,
    fade: darkGreen,
    highlight: naturalYellow,
    highlightAccent: naturalYellow,
    highlightContrast: white
  }
} as Colorscheme;
