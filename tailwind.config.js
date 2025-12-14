/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // Next.js app router pages
    "./components/**/*.{js,ts,jsx,tsx}", // Shared components (if any)
    "./public/**/*.html",                // HTML files in public (if any)
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Scroll chain branding
        scroll: {
          50: '#e6f7ff',
          100: '#b3e0ff',
          200: '#80c9ff',
          300: '#4db2ff',
          400: '#1a9bff',
          500: '#0084ff', // Primary Scroll blue
          600: '#0066cc',
          700: '#004799',
          800: '#002966',
          900: '#000a33',
          DEFAULT: '#0084ff',
        },
        // EVM chain colors
        ethereum: {
          DEFAULT: '#627eea',
          dark: '#3c3c3d',
        },
        solana: {
          DEFAULT: '#9945FF',
          light: '#BC7AF9',
          dark: '#7B2CBF',
        },
        // Base chain
        base: {
          DEFAULT: '#0052ff',
          light: '#3d7dff',
          dark: '#0039b3',
        },
        // Primary colors
        primary: '#00c853', // Keep your green
        secondary: '#2962ff', // Keep your blue
        // Dark mode palette
        dark: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          lighter: '#334155',
          dark: '#020617',
        },
        // Success/Error states
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'], // Modern display font
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        '3xs': '0.5rem',   // 8px
      },
      spacing: {
        '18': '4.5rem',    // 72px
        '88': '22rem',     // 352px
        '128': '32rem',    // 512px
        '144': '36rem',    // 576px
      },
      animation: {
        // Web3/Blockchain animations
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'progress': 'progress 1s ease-in-out infinite',
        'connect': 'connect 0.3s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        connect: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        // Gradient backgrounds
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-scroll': 'linear-gradient(135deg, #0084ff 0%, #00c853 100%)',
        'gradient-ethereum': 'linear-gradient(135deg, #627eea 0%, #8a2be2 100%)',
        'gradient-solana': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-grid': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(30 41 59 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      },
      boxShadow: {
        // Enhanced shadows
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'neon': '0 0 20px rgba(0, 132, 255, 0.5)',
        'neon-green': '0 0 20px rgba(0, 200, 83, 0.5)',
        'neon-purple': '0 0 20px rgba(153, 69, 255, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(0, 132, 255, 0.1)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 10px 40px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      // Custom utilities for web3 components
      zIndex: {
        'modal': '1000',
        'dropdown': '1100',
        'tooltip': '1200',
        'toast': '1300',
        'wallet': '1400',
      },
      // Custom border radii
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // Custom widths/heights for crypto elements
      width: {
        'wallet': '24rem', // Standard wallet modal width
        'chain-icon': '1.5rem',
        'token-icon': '2rem',
      },
      height: {
        'wallet': '32rem', // Standard wallet modal height
        'chain-icon': '1.5rem',
        'token-icon': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Better form styles
    require('@tailwindcss/typography'), // Prose styles
    require('tailwindcss-animate'), // Animation utilities
  ],
}