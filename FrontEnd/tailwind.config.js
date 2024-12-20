/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes :{
        'bounce' : {
          '0%' : 'translateY(0)',
          '50%' : 'translateY(-10px)',
          '100%' : 'translateY(0)'
        },
        'fadein' : {
          '0%' : 'opacity(0)',
          '10%' : 'opacity(100)'
        },
      },
      animation : {
        'bounce' : 'bounce 1s ease-in-out infinite',
        'fadein' : 'fadein 0.3s ease'
      },
      fontFamily : {
        'Parkinsans' : ["Parkinsans", "sans-serif"],
        'Montserrat' : ["Montserrat", "sans-serif"],
        'Poppins' : ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
  ],
}

