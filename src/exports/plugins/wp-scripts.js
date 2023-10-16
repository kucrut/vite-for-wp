import externals from 'vite-plugin-external';
import globals from 'rollup-plugin-external-globals';
import { wp_globals } from '../utils/wp-globals.js';

/** @typedef {import('vite').PluginOption} Plugin */

/**
 * WPScriptsOptions
 *
 * @typedef WPScriptsOptions
 *
 * @property {{[k:string]: string}=} extraScripts Extra scripts to add.
 */

/**
 * WordPress scripts plugin
 *
 * Provide easy access to built-in WordPress scripts and exclude them from the final build.
 *
 * @since 0.7.0
 * @type {(options?: WPScriptsOptions) => Plugin}
 * @param {WPScriptsOptions} options Plugin options.
 * @return {Plugin} Vite plugins objects.
 */
export function wp_scripts( options = {} ) {
	const { extraScripts = {} } = options;

	const scripts = {
		...wp_globals(),
		...extraScripts,
	};

	/** @type {Plugin} */
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
