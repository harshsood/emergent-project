module.exports = {
  // Ensure Tailwind scans your source files so utilities are generated
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,html}",
    "./src/**/*.{css}",
    "./public/**/*.{html}",
    "./app/**/*.{js,ts,jsx,tsx}",
        "*.{js,ts,jsx,tsx,mdx}"
    ],
  theme: {
    extend: {
      colors: {
        /* Map your HSL CSS variables so classes like text-foreground, bg-background exist.
           Support opacity-aware usage like bg-background/50 or text-foreground/80. */
        foreground: ({ opacityValue }) =>
          opacityValue ? `hsl(var(--foreground) / ${opacityValue})` : `hsl(var(--foreground))`,
        primary: ({ opacityValue }) =>
          opacityValue ? `hsl(var(--primary) / ${opacityValue})` : `hsl(var(--primary))`,
        "primary-foreground": ({ opacityValue }) =>
          opacityValue ? `hsl(var(--primary-foreground) / ${opacityValue})` : `hsl(var(--primary-foreground))`,
        background: ({ opacityValue }) =>
          opacityValue ? `hsl(var(--background) / ${opacityValue})` : `hsl(var(--background))`,
        card: ({ opacityValue }) =>
          opacityValue ? `hsl(var(--card) / ${opacityValue})` : `hsl(var(--card))`,
        "card-foreground": ({ opacityValue }) =>
          opacityValue ? `hsl(var(--card-foreground) / ${opacityValue})` : `hsl(var(--card-foreground))`,
        border: ({ opacityValue }) =>
          opacityValue ? `hsl(var(--border) / ${opacityValue})` : `hsl(var(--border))`,
        input: ({ opacityValue }) =>
          opacityValue ? `hsl(var(--input) / ${opacityValue})` : `hsl(var(--input))`,
        accent: ({ opacityValue }) =>
          opacityValue ? `hsl(var(--accent) / ${opacityValue})` : `hsl(var(--accent))`,
        "muted-foreground": ({ opacityValue }) =>
          opacityValue ? `hsl(var(--muted-foreground) / ${opacityValue})` : `hsl(var(--muted-foreground))`,
      },
      ringColor: {
        DEFAULT: "hsl(var(--primary))",
      },
    },
  },
  plugins: [],
};
