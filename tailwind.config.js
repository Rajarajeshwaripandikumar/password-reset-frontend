// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // important — ensures Tailwind scans your components
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        districtBg: "#0f1724",
        primaryYellow: "#FFC220",
        walmartBlue: {
          DEFAULT: "#0071DC",
          dark: "#0654BA"
        },
        panel: "#ffffff",
        softBorder: "#111827",
        pageGradientStart: "#f3f7ff",
        pageGradientEnd: "#eff3fb"
      },
      boxShadow: {
        'soft': '0 6px 18px rgba(7,15,37,0.06)'
      },
      borderRadius: {
        'lg-2xl': '18px'
      }
    }
  },
  plugins: [],
}
