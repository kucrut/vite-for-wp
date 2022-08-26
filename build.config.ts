import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig( {
	entries: [
		'./src/index',
		{
			name: 'plugins/index',
			input: './src/plugins/index',
		},
		{
			name: 'utils/index',
			input: './src/utils/index',
		},
	],
	clean: false,
	declaration: true,
	outDir: '.',
	externals: [ 'vite' ],
	rollup: {
		emitCJS: true,
		inlineDependencies: true,
	},
} );
