import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "'Nunito Sans', sans-serif",
    heading: "'Nunito Sans', sans-serif",
  },
  colors: {
    primary: {
      "50": "#EBE8FD",
      "100": "#C7BEF9",
      "200": "#A294F5",
      "300": "#7E6AF1",
      "400": "#5A40ED",
      "500": "#3516E9",
      "600": "#2B11BB",
      "700": "#200D8C",
      "800": "#15095D",
      "900": "#0B042F",
    },
    secondary: {
      "50": "#FEE6E6",
      "100": "#FDBABA",
      "200": "#FB8E8E",
      "300": "#FA6161",
      "400": "#F83535",
      "500": "#F60909",
      "600": "#C50707",
      "700": "#940505",
      "800": "#630303",
      "900": "#310202",
    },
  },

  components: {
    Button: {
      baseStyle: {
        rounded: "4px",
      },
      sizes: {
        md: {
          py: 2,
        },
      },
    },
  },
});
export default theme;
