/** @typedef {import('vite').ResolvedConfig} ResolvedConfig */
/** @typedef {import('vite').UserConfig} UserConfig */
/** @typedef {Record< string, any >} ExtraConfig */
/** @typedef {ResolvedConfig[ 'build' ][ 'rollupOptions' ][ 'input' ]} InputOption */

// See https://vitejs.dev/config/

import { createLogger, mergeConfig } from 'vite';

import { v4wp } from './plugins/v4wp.js';
import { dev_server_config } from './plugins/dev-server-config.js';
import { dev_server_manifest } from './plugins/dev-server-manifest.js';

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
