module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#4CAF50',
        'game-secondary': '#2196F3',
        'game-accent': '#FF9800',
        'game-neutral': '#9E9E9E',
        'game-base-100': '#1A1A2E',
        'game-base-200': '#16213E',
        'game-base-300': '#0F3460',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gamedev: {
          "primary": "#4CAF50",
          "secondary": "#2196F3",
          "accent": "#FF9800",
          "neutral": "#9E9E9E",
          "base-100": "#1A1A2E",
          "base-200": "#16213E",
          "base-300": "#0F3460",
        },
      },
    ],
  },
}