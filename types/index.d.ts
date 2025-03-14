declare module '@kucrut/vite-for-wp' {
	import type { ResolvedConfig } from 'vite';
	/**
	 * v4wp
	 *
	 * Vite plugin to simplify plugins & themes development on WordPress with Vite.
	 *
	 * @since 0.7.0
	 *
	 * @param options Plugin options (optional).
	 * @return {import('vite').PluginOption[]} Vite plugin objects.
	 */
	export function v4wp(options?: V4wpOptions | undefined): import("vite").PluginOption[];
	/**
	 * Create vite config
	 *
	 * @deprecated Use v4wp() instead.
	 *
	 * @param input        Entry points. See https://rollupjs.org/configuration-options/#input
	 * @param out_dir      Output directory. See https://vitejs.dev/config/build-options.html#build-outdir
	 * @param extra_config Extra configuration.
	 *
	 * @return {import('vite').UserConfig} Vite configuration object.
	 */
	export default function create_config(input: Input, out_dir: string, extra_config?: import("vite").UserConfig | undefined): import("vite").UserConfig;
	type Input = ResolvedConfig['build']['rollupOptions']['input'];
	interface V4wpOptions {
		/**
		 * @description Entry points (optional, defaults to 'src/main.js'). See https://rollupjs.org/configuration-options/#input
		 */
		input?: Input;
		/**
		 * @description Output directory (optional, defaults to 'dist'). See https://vitejs.dev/config/build-options.html#build-outdir
		 */
		outDir?: ResolvedConfig['build']['outDir'];
	}

	export {};
}

declare module '@kucrut/vite-for-wp/plugins' {
	/**
	 * Dev server plugin
	 *
	 * @since 0.1.0
	 * @since 0.8.0 Accept options.
	 *
	 * @param options Plugin options.
	 * @return {import('vite').Plugin<import('../../types.ts').DevServerOptions>} Plugin object.
	 */
	export function dev_server(options?: DevServerOptions | undefined): import("vite").Plugin<DevServerOptions>;
	/**
	 * WPScriptsOptions
	 *
	 * */
	/**
	 * WordPress scripts plugin
	 *
	 * Provide easy access to built-in WordPress scripts and exclude them from the final build.
	 *
	 * @since 0.7.0
	 * @since 0.8.0  Import dependencies dynamically.
	 * @since 0.11.0 Remove vite-plugin-external dependency.
	 * @since 0.11.1 Bring back vite-plugin-external dependency with proper args.
	 *
	 * @param options Plugin options.
	 * @return {Promise<import('vite').PluginOption[]>} Vite plugins objects.
	 */
	export function wp_scripts(options?: WPScriptsOptions): Promise<import("vite").PluginOption[]>;
	/**
	 * WPScriptsOptions
	 */
	type WPScriptsOptions = {
		/**
		 * Extra scripts to add.
		 */
		extraScripts?: {
			[k: string]: string;
		} | undefined;
	};
	interface DevServerOptions {
		/**
		 * @description Path to directory where the dev server manifest should be stored. Defaults to the value of `build.outDir` option.
		 */
		manifest_dir?: string;
	}

	export {};
}

declare module '@kucrut/vite-for-wp/utils' {
	/**
	 * Given a kebab-case string, returns a new camelCase string.
	 *
	 * @param str Input kebab-case string.
	 * @return {string} Camel-cased string.
	 */
	export function camel_case_dash(str: string): string;
	/**
	 * Choose port
	 *
	 * Stolen from vite.
	 *
	 * @param options Options.
	 * @return {Promise<number>}  Chosen port.
	 */
	export function choose_port(options?: ChoosePortOptions): Promise<number>;
	/**
	 * Get all global scripts registered by WordPress
	 *
	 * @return {Record<string, string>} Object containing global script names registered by WordPress.
	 */
	export function wp_globals(): Record<string, string>;
	interface ChoosePortOptions {
		/**
		 * @default localhost
		 * @description Host name or IP address, defaults to 'localhost'.
		 */
		host?: string;
		/**
		 * @default 5173
		 * @description Preferred port number, defaults to 5173.
		 */
		port?: number;
	}

	export {};
}

//# sourceMappingURL=index.d.ts.map