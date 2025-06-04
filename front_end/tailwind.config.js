module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Spotify/Apple inspired
          spotify: {
            green: '#1DB954', // Spotify green
            dark: '#191414',  // Spotify black
          },
          apple: {
            red: '#FC3C44',   // Apple Music red
            white: '#FAFAFA', // Apple white
          },
          // Gradients
          primary: {
            from: '#1DB954', // Spotify green
            via: '#FC3C44',  // Apple red
            to: '#191414',   // Spotify black
          },
          // Greys
          'gray-900': '#121212',
          'gray-800': '#181818',
          'gray-700': '#282828',
          // Utility
          accent: '#FC3C44',
          brand: '#1DB954',
          background: '#181818',
          surface: '#232323',
          border: '#282828',
          muted: '#e0e0e0',
          white: '#ffffff',
          black: '#191414',
          primary: '#ffffff',
        },
        fontFamily: {
          sans: [
            'Inter',
            'system-ui',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
          ],
          display: [
            'Montserrat',
            'ui-sans-serif',
            'system-ui',
          ],
        },
        boxShadow: {
          card: '0 4px 32px 0 rgba(0,0,0,0.12)',
          player: '0 -2px 16px 0 rgba(0,0,0,0.24)',
        },
        borderRadius: {
          xl: '1.25rem',
          '2xl': '2rem',
        },
        spacing: {
          18: '4.5rem',
          88: '22rem',
        },
        backgroundImage: {
          'gradient-spotify-apple': 'linear-gradient(90deg, #1DB954 0%, #FC3C44 100%)',
          'gradient-hero': 'linear-gradient(135deg, #1DB954 0%, #FC3C44 60%, #191414 100%)',
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }