import { createBundle } from 'dts-buddy';

createBundle( {
	include: [ 'src' ],
	output: 'types/index.d.ts',
	modules: {
		'@kucrut/vite-for-wp': 'src/exports/index.js',
		'@kucrut/vite-for-wp/utils': 'src/exports/utils/index.js',
	},
} );
