module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        indigo: { 700: "#32628d" },
        dark_navy_blue: "#001a33", // Define the darker navy blue color
        blue_gray: { 50: "#edf2f7", 700: "#425466", 900: "#27272e", "700_b2": "#464a6fb2" },
        white: { A700: "#ffffff" },
        gray: { 50: "#fbfcfc", 800: "#353945", "900_01": "#22262e", "900_e5": "#001d34e5", "700_01": "#5f5f5f" },
        black: { 900: "#000000" },
        blue: { 100: "#d0e4ff" },
        green: { 400: "#66cb7c" },
        gray_900: "#131416",
        indigo_A200: "#4c6fff",
        gray_700_4f: "#5f5f5f4f",
      },
      boxShadow: {
        xs: "0px 4px  4px 0px #00000059",
        sm: "0px 4px  4px 0px #0000003f",
        md: "0px 4px  14px 0px #00000019",
      },
      fontFamily: { poppins: "Poppins", inter: "Inter", dmsans: "DM Sans", montserrat: "Montserrat" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
