/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    red: '#D0202F', // The Logo Red
                    neon: '#FF2A3C', // Glowing accent
                    black: '#0A0A0A', // Deepest background
                    obsidian: '#121212', // Card background
                    carbon: '#18181B', // Textured areas
                    silver: '#E5E7EB', // Text
                    muted: '#9CA3AF', // Muted text
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Rajdhani', 'sans-serif'], // Tech/Automotive font
            },
            backgroundImage: {
                'carbon-fiber': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
