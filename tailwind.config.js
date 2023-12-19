export default {
  theme: {
    screens: {
      xs: '466px',

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      colors: {
        mainGreen: {
          50: '#feffe4',
          100: '#fbffc5',
          200: '#f4ff92',
          300: '#e7ff54',
          400: '#d7fa21',
          500: '#c2ec01',
          600: '#8fb400',
          700: '#6c8902',
          800: '#556b09',
          900: '#485a0d',
          950: '#253300',
        },
        mainRed: {
          50: '#fff3f1',
          100: '#ffe4e0',
          200: '#ffcdc6',
          300: '#ffaa9e',
          400: '#ff7866',
          500: '#fd4e36',
          600: '#eb3117',
          700: '#c6250f',
          800: '#a32311',
          900: '#872315',
          950: '#4a0d05',
        },
        mainBlackBg: {
          DEFAULT: '#1D1D1E',
        },
        mainBlackInput: {
          DEFAULT: '#262627',
        },
        mainBlackRing: {
          DEFAULT: '#323233',
        },
      },
    },
  },
}
