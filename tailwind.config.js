/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  darkMode:'class',
  theme: {
    container:{
      center: true,
    },
    extend: {
      fontFamily :{
        'Roboto' : ['Roboto'],
        'Poppin': ["Montserrat", "sans-serif"]
      },
      colors:{
        lightHeader :'#B1B2FF',
        lightMain: '#D2DAFF',
        lightContainer: '#EEF1FF',
        lightText: '#262626',
        lightIcon: '#AAC4FF',
        lightIconFocus: '#8fb0ff',
        lightFooter : '#8a8cff',

        darkHeader:'#00bdc7',
        darkMain:'#222831',
        darkContainer:'#393E46',
        darkText:'#e6e6e6',
        darkIcon : '#00ADB5',
        darkIconFocus: '#009199',
        darkFooter:'#006f75',
      },
    },
  },
  plugins: [],
}

