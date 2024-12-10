/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      gridColumn: {
        'span-16': 'span 16 / span 16',
        'span-15': 'span 15 / span 15',
        'span-14': 'span 14 / span 14',
        'span-13': 'span 13 / span 13',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
      },
    },
  },
  safelist: [
    {
      pattern: /col-span-\d+/,
    },
    {
      pattern: /h-\d+/,
    },
    {
      pattern: /w-\d+/,
    },
  ],
  plugins: [],
}

