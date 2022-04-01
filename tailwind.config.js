const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	theme: {
		extend: {
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				gray: colors.stone,
				red: colors.red,
				blue: colors.sky,
				green: colors.emerald,
				yellow: colors.amber,
				purple: colors.violet,
			}
		},
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
	],
}
