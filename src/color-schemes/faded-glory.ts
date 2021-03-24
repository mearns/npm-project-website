import { Colorscheme } from "./_types";
/**
 * Credit: https://hookagency.com/website-color-schemes/
 */
const redHighlight = "#B73225";
const blueMinded = "#004E7C";
const pondReflection = "#7EAAC4";
const maroon6 = "#591C0B";
const greyWater = "#5C5F58";
const lighterGrey = "#DCE1E3";
const softBlueGrey = "#a5bdc7";
const deepBlue = "#040F16";
const blueSlate = "#00263d";
const white = "#FFFFFF";

export default {
  name: "Faded Glory",
  light: {
    background: lighterGrey,
    primary: greyWater,
    accent: blueMinded,
    fade: pondReflection,
    highlight: redHighlight,
    highlightAccent: maroon6,
    highlightContrast: white
  },
  dark: {
    background: deepBlue,
    primary: softBlueGrey,
    accent: blueMinded,
    fade: blueSlate,
    highlight: redHighlight,
    highlightAccent: maroon6,
    highlightContrast: white
  }
} as Colorscheme;
