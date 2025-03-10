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
 * @since 0.8.0  Import dependencies dynamically.
 * @since 0.11.0 Remove vite-plugin-external dependency.
 *
 * @type {(options?: WPScriptsOptions) => Plugin}
 * @param {WPScriptsOptions} options Plugin options.
 * @return {Promise<Plugin>} Vite plugins objects.
 */
export async function wp_scripts( options = {} ) {
	const { default: external_globals } = await import( 'rollup-plugin-external-globals' );

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
		external_globals( scripts ),
	];
}
