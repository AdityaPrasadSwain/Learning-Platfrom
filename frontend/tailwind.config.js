/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                ai: {
                    base: '#0f172a', // Slate 900
                    surface: '#1e293b', // Slate 800
                    accent: '#3b82f6', // Blue 500
                    highlight: '#10b981', // Emerald 500
                    soft: '#f8fafc', // Slate 50
                    card: '#ffffff',
                },
                brand: {
                    primary: '#14b8a6', // Teal 500
                    secondary: '#0ea5e9', // Sky 500
                    accent: '#6366f1', // Indigo 500
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
            animation: {
                'float-slow': 'float 8s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                }
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            }
        },
    },
    plugins: [],
}
