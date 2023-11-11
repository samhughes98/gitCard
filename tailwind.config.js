import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {

            container: {
                center: true,
                padding: '1rem',
            },
            textColor: {
                primary: '#fff',
                secondary: 'blue',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },

            colors:{
                dark: '#202124',
                darkLight: '#040D12',
                light: '#fafbfc',
                accent: '#0065bd',
            },
        },
    },

    plugins: [forms, typography],
};
