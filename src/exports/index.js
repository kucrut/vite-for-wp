import { createLogger, mergeConfig } from 'vite';
import { dev_server } from './plugins/dev-server.js';

/**
 * v4wp
 *
 * Vite plugin to simplify plugins & themes development on WordPress with Vite.
 *
 * @since 0.7.0
 *
 * @param {import('../types.ts').V4wpOptions=} options Plugin options (optional).
 * @return {import('vite').PluginOption[]} Vite plugin objects.
 */
export function v4wp( options = {} ) {
	const { input, outDir } = options;

	/** @type {import('vite').Plugin} */
	const plugin = {
		name: 'v4wp:config',
		enforce: 'pre',

		config( config ) {
			return {
				base: './',
				build: {
					outDir,
					emptyOutDir: true,
					manifest: 'manifest.json',
					modulePreload: false,
					rollupOptions: { input },
					sourcemap: config.build?.sourcemap ?? true,
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
 * @param {import('../types.ts').Input} input        Entry points. See https://rollupjs.org/configuration-options/#input
 * @param {string}                      out_dir      Output directory. See https://vitejs.dev/config/build-options.html#build-outdir
 * @param {import('vite').UserConfig=}  extra_config Extra configuration.
 *
 * @return {import('vite').UserConfig} Vite configuration object.
 */
export default function create_config( input, out_dir, extra_config ) {
	createLogger().warnOnce(
		// eslint-disable-next-line @stylistic/max-len
		'[Vite for WP]: create_config() is deprecated and will be removed in version 1.0. Please use the `v4wp` plugin instead.',
		{ clear: false },
	);

	/** @type {import('vite').UserConfig} */
	let config = {
		clearScreen: false,
		plugins: [ v4wp( { input, outDir: out_dir } ), dev_server() ],
	};

	if ( extra_config ) {
		config = mergeConfig( config, extra_config );
	}

	return config;
}
