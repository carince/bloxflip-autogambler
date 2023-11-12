/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                primary: "#282828",
                secondary: "#ebdbb2",
                tertiary: "#3c3836",
                "black-100": "#32302f",
                "black-200": "#1d2021",
                "white-100": "#f3f3f3",
            }
        },
    },
    plugins: [],
};
