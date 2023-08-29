module.exports = {
  content: ["./src/*.html", "./src/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "daily-dev-tips": "#F89283",
        deepBlue: "#262634",
        whiteSmoke: "#F5F5F5",
        burntSienna: "#EF8569",
      },
      dropShadow: {
        glow: ["0 0px 20px rgba(255,255, 255, 0.35)", "0 0px 65px rgba(255, 255,255, 0.2)"],
      },
      fontFamily: {
        libre: ['"Libre Baskerville"', "serif"],
        lora: ['"Lora"', "serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
