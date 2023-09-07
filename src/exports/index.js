/** @typedef {import('vite').ResolvedConfig} ResolvedConfig */
/** @typedef {import('vite').UserConfig} UserConfig */
/** @typedef {Record< string, any >} ExtraConfig */
/** @typedef {ResolvedConfig[ 'build' ][ 'rollupOptions' ][ 'input' ]} InputOption */

// See https://vitejs.dev/config/

import { mergeConfig } from 'vite';

import { dev_server_config } from '../plugins/dev-server-config.js';
import { dev_server_manifest } from '../plugins/dev-server-manifest.js';

/**
 * Create vite config
 *
 * @type {(input: InputOption, out_dir: string, extra_config?: ExtraConfig) => UserConfig}
 * @param {InputOption}  input        Input file(s).
 * @param {string}       out_dir      Output directory.
 * @param {ExtraConfig=} extra_config Extra configuration.
 *
 * @return {UserConfig}  Vite configuration object.
 */
export default function create_config( input, out_dir, extra_config ) {
	/** @type {UserConfig} */
	let config = {
		base: './',
		build: {
			emptyOutDir: true,
			manifest: true,
			modulePreload: false,
			outDir: out_dir,
			rollupOptions: { input },
			sourcemap: true,
		},
		css: {
			devSourcemap: true,
		},
		plugins: [ dev_server_config(), dev_server_manifest() ],
	};

	if ( extra_config ) {
		config = mergeConfig( config, extra_config );
	}

	return config;
}
