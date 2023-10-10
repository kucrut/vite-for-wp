/** @typedef {{extraScripts?: Record<string, string>}} Options */

import externals from 'vite-plugin-external';
import globals from 'rollup-plugin-external-globals';
import { wp_globals } from '../utils/wp-globals.js';

/**
 * WordPress scripts plugin
 *
 * This plugin provides easy access to built-in WordPress scripts and exclude them from the build.
 *
 * @since 0.7.0
 *
 * @type {(options?: Options) => import('vite').PluginOption[]}
 * @return {import('vite').PluginOption[]} Vite plugins instances.
 */
export function wp_scripts( options = {} ) {
	const { extraScripts = {} } = options;

	const scripts = {
		...wp_globals(),
		...extraScripts,
	};

	/** @type { import('vite').Plugin } */
	const plugin = {
		name: 'v4wp:wp-scripts',
		apply: 'build',

		config() {
			return {
				build: {
					rollupOptions: {
						external: Object.keys( scripts ),
						output: {
							globals: scripts,
						},
					},
				},
			};
		},
	};

	return [
		plugin,
		externals( {
			externals: scripts,
		} ),
		globals( scripts, {
			include: [ '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx' ],
		} ),
	];
}
