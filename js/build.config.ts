import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig( {
	entries: [
		'./src/index',
		{
			name: 'plugins/index',
			input: './src/plugins/index',
			// outDir: './dist/plugins',
		},
		{
			name: 'utils/index',
			input: './src/utils/index',
			// outDir: './dist/utils',
		},
	],
	clean: true,
	declaration: true,
	externals: [ 'vite' ],
	rollup: {
		emitCJS: true,
		inlineDependencies: true,
	},
} );
