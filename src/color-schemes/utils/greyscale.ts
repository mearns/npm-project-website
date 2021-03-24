import { Colorscheme, Color } from "../_types";

const blackish = "#202020";
const darkGrey = "#3F3F3F";
const mediumGrey = "#707070";
const lightGrey = "#B0B0B0B0";
const realLightGrey = "#D0D0D0";
const white = "#FFFFFF";

export default function greyscale(
  color: Color,
  colorName: string
): Colorscheme {
  return {
    name: `Greyscale + One (${colorName})`,
    light: {
      background: white,
      primary: darkGrey,
      accent: blackish,
      fade: lightGrey,
      highlight: color,
      highlightAccent: color,
      highlightContrast: blackish
    },
    dark: {
      background: blackish,
      primary: realLightGrey,
      accent: white,
      fade: mediumGrey,
      highlight: color,
      highlightAccent: color,
      highlightContrast: blackish
    }
  };
}
