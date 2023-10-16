import { createLogger, mergeConfig } from 'vite';
import { dev_server } from './plugins/dev-server.js';

/** @typedef {import('vite').UserConfig} UserConfig */
/** @typedef {import('vite').ResolvedConfig['build']['rollupOptions']['input']} Input */
/** @typedef {import('vite').ResolvedConfig['build']['outDir']} OutDir */
/** @typedef {import('vite').PluginOption} Plugin */

/**
 * v4wp options
 *
 * @typedef V4wpOptions
 *
 * @property {Input=}  input  Entry points (optional, defaults to 'src/main.js'). See https://rollupjs.org/configuration-options/#input
 * @property {OutDir=} outDir Output directory (optional, defaults to 'dist'). See https://vitejs.dev/config/build-options.html#build-outdir
 */

/**
 * v4wp
 *
 * Vite plugin to simplify plugins & themes development on WordPress with Vite.
 *
 * @since 0.7.0
 *
 * @type {(options?: V4wpOptions) => Plugin}
 * @param {V4wpOptions=} options Plugin options (optional).
 * @return {Plugin} Vite plugin objects.
 */
export function v4wp( options = {} ) {
	const { input, outDir } = options;

	/** @type {Plugin} */
	const plugin = {
		name: 'v4wp:config',
		enforce: 'pre',

		config() {
			return {
				base: './',
				build: {
					outDir,
					emptyOutDir: true,
					manifest: true,
					modulePreload: false,
					rollupOptions: { input },
					sourcemap: true,
				},
				css: {
					devSourcemap: true,
				},
			};
		},
	};

	return [ plugin, dev_server() ];
}

/**
 * Create vite config
 *
 * @deprecated Use v4wp() instead.
 *
 * @type {(input: Input, out_dir: string, extra_config?: UserConfig) => UserConfig}
 *
 * @param {Input}       input        Entry points. See https://rollupjs.org/configuration-options/#input
 * @param {string}      out_dir      Output directory. See https://vitejs.dev/config/build-options.html#build-outdir
 * @param {UserConfig=} extra_config Extra configuration.
 *
 * @return {UserConfig}  Vite configuration object.
 */
export default function create_config( input, out_dir, extra_config ) {
	createLogger().warnOnce(
		'[Vite for WP]: create_config() is deprecated and will be removed in version 1.0. Please use the `v4wp` plugin instead.',
		{ clear: false },
	);

	/** @type {UserConfig} */
	let config = {
		clearScreen: false,
		plugins: [ v4wp( { input, outDir: out_dir } ), dev_server() ],
	};

	if ( extra_config ) {
		config = mergeConfig( config, extra_config );
	}

	return config;
}
