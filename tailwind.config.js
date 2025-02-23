/** @type {import('tailwindcss').Config} */
import colors from './colors';
export default {
	// Specify the paths to all of your template files
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			colors: colors
		}
	},
	plugins: [
		// Optional: Add Tailwind plugins here
	],
	darkMode: 'class'
};
