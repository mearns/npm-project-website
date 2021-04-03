export enum IconPurpose {
  monochrome = "monochrome",
  maskable = "maskable",
  darkmode = "darkmode",
  lightmode = "lightmode",
  any = "any"
}

export interface Icon {
  src: string;
  type: string;
  sizes: "any" | Array<[number, number]>;
  purpose: Array<IconPurpose>;
}

export interface Manifest {
  icons?: Array<Icon>;
}
