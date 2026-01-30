import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                cyan: {
                    50: '#e0fcfd',
                    100: '#c2f8fb',
                    200: '#a3f3f9',
                    300: '#85eff7',
                    400: '#66eaf5',
                    500: '#00f0ff', // Cyberpunk standard
                    600: '#00c0cc',
                    700: '#009099',
                    800: '#006066',
                    900: '#003033',
                }
            }
        },
    },
    plugins: [],
};
export default config;
