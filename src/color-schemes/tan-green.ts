import { Colorscheme } from "./_types";
/**
 * Credit: https://www.gattoweb.com/, found on https://hookagency.com/website-color-schemes/
 */
const makeupTan = "#DDAF94";
const blush = "#E8CEBF";
const complimentaryGreen = "#266150";
const contrastyGreen = "#2e7561";
const darkHighlight = "#4F4846";
const darkerHighlight = "#23201f";
const lightlyOffWhite = "#FDF8F5";

export default {
  name: "Tan + Green Website Color Scheme 2021 by Gatto Web",
  light: {
    background: lightlyOffWhite,
    primary: darkHighlight,
    accent: complimentaryGreen,
    fade: blush,
    highlight: complimentaryGreen,
    highlightAccent: makeupTan,
    highlightContrast: lightlyOffWhite
  },
  dark: {
    background: darkerHighlight,
    primary: lightlyOffWhite,
    accent: makeupTan,
    fade: darkHighlight,
    highlight: contrastyGreen,
    highlightAccent: makeupTan,
    highlightContrast: lightlyOffWhite
  }
} as Colorscheme;
