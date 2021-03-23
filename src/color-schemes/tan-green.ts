import { Colorscheme } from "./_types";
/**
 * Credit: https://www.gattoweb.com/, found on https://hookagency.com/website-color-schemes/
 */
const makeupTan = "#DDAF94";
const blush = "#E8CEBF";
const complimentaryGreen = "#266150";
const darkHighlight = "#4F4846";
const lightlyOffWhite = "#FDF8F5";

export default {
  name: "Tan + Green Website Color Scheme 2021 by Gatto Web",
  light: true,
  roles: {
    background: lightlyOffWhite,
    primary: darkHighlight,
    accent: complimentaryGreen,
    fade: blush,
    highlight: complimentaryGreen,
    highlightAccent: makeupTan,
    highlightContrast: lightlyOffWhite
  }
} as Colorscheme;
