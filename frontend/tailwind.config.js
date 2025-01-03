/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'my-nude':'#F5E8DD',
        'my-pink':'#EED3D9',
        'my-blue':'#B5C0D0',
        'my-green':'#CCD3CA',
        'my-green2': '#B1C29E'
      }
    },
  },
  plugins: [],
}

