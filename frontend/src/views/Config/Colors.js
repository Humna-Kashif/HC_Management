import Color from "color";

export default {
  background: "#ebecee",
  baseColor: "#f5f6f8",
  // baseColor: Color("#f5f6f8").lighten(0.01),
  baseShadow: Color("#fff").darken(0.1),

  baseBg1: Color("#ebecee").darken(0.01),
  baseBg2: Color("#ebecee").darken(0.1),

  baseColorDarker: Color("#f5f6f8").darken(0.01),
  baseColorDarker2: Color("#f5f6f8").darken(0.05),

  white: "#ffffff",
  black: "#000000",

  primaryColor: "#e0004d",
  primaryLight: Color("#e0004d").lighten(0.2),
  primaryLight2: "#ffffffc1",
  primaryDark: Color("#e0004d").darken(0.03),
  primaryDark2: Color("#e0004d").darken(0.2),
};
