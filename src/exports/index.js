/** @typedef {import('vite').ResolvedConfig} ResolvedConfig */
/** @typedef {import('vite').UserConfig} UserConfig */
/** @typedef {Record< string, any >} ExtraConfig */
/** @typedef {ResolvedConfig[ 'build' ][ 'rollupOptions' ][ 'input' ]} InputOption */
/** @typedef {{input?: InputOption, outDir?: ResolvedConfig['build']['outDir']}} Options */

import { createLogger, mergeConfig } from 'vite';
import { dev_server_config } from './plugins/dev-server.js/index.js';
import { dev_server_manifest } from './plugins/dev-server-manifest.js';

/**
 * Vite for WP
 *
 * @type {(options: Options) => import('vite').PluginOption[]}
 */
export function v4wp( options = {} ) {
	const { input = 'src/main.js', outDir } = options;

	/** @type { import('vite').Plugin } */
	const plugin = {
		name: 'v4wp:config',
		enforce: 'pre',

		async config() {
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

	return [ plugin, dev_server_config(), dev_server_manifest() ];
}

/**
 * Create vite config
 *
 * @deprecated
 *
 * @type {(input: InputOption, out_dir: string, extra_config?: ExtraConfig) => UserConfig}
 * @param {InputOption}  input        Input file(s).
 * @param {string}       out_dir      Output directory.
 * @param {ExtraConfig=} extra_config Extra configuration.
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
		plugins: [ v4wp( { input, outDir: out_dir } ), dev_server_config(), dev_server_manifest() ],
	};

	if ( extra_config ) {
		config = mergeConfig( config, extra_config );
	}

	return config;
}
