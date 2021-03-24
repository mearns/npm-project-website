import { Colorscheme } from "./_types";
/**
 * Credit: https://hookagency.com/website-color-schemes/
 */
const brightRed = "#DE354C";
const deepRed = "#932432";
const purePurple = "#3C1874";
const purpleTingedGrey = "#283747";
const darkTingedGrey = "#08121c";
const cloud = "#F3F3F3";
const fadedPurple = "#baa8d6";
const fadedBrightRed = "#d6a8af";

export default {
  name: "infrared",
  light: {
    background: cloud,
    primary: purpleTingedGrey,
    accent: purePurple,
    fade: fadedPurple,
    highlight: deepRed,
    highlightAccent: brightRed,
    highlightContrast: fadedBrightRed
  },
  dark: {
    background: darkTingedGrey,
    primary: cloud,
    accent: fadedPurple,
    fade: purpleTingedGrey,
    highlight: deepRed,
    highlightAccent: brightRed,
    highlightContrast: fadedBrightRed
  }
} as Colorscheme;
