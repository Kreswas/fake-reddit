/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        comment: '#2b2b2b',
        comment_light: '#F3F4F6',
        hr_color: '#8c8b8b',
        form: '#1A1A1B',
        // post: '#272729',
      },
    },
  },
  plugins: [],
};
