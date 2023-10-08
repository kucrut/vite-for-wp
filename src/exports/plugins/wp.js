/** @typedef {import('vite').ResolvedConfig} ResolvedConfig */
/** @typedef {ResolvedConfig[ 'build' ][ 'rollupOptions' ][ 'input' ]} InputOption */
/** @typedef {{input?: InputOption, outDir?: ResolvedConfig['build']['outDir']}} Options */

import { dev_server_config } from './dev-server-config.js';
import { dev_server_manifest } from './dev-server-manifest.js';

/**
 * Plugin for WP
 *
 * @type {(options: Options) => import('vite').PluginOption[]}
 */
export function wp( options = {} ) {
	const { input = 'app/src/main.js', outDir = 'app/dist' } = options;

	/** @type { import('vite').Plugin } */
	const config_plugin = {
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

	return [ config_plugin, dev_server_config(), dev_server_manifest() ];
}
