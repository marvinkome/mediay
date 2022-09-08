import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "'Nunito Sans', sans-serif",
    heading: "'Nunito Sans', sans-serif",
  },
  colors: {
    primary: {
      "50": "#EDEDF8",
      "100": "#CDCDEA",
      "200": "#ADACDD",
      "300": "#8D8CCF",
      "400": "#6D6BC2",
      "500": "#4D4BB4",
      "600": "#3E3C90",
      "700": "#2E2D6C",
      "800": "#1F1E48",
      "900": "#0F0F24",
    },
  },
});
export default theme;
