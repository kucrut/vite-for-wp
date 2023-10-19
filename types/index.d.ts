declare module '@kucrut/vite-for-wp' {
	export function v4wp(options?: V4wpOptions): Plugin;
	export default function create_config(input: Input, out_dir: string, extra_config?: UserConfig): UserConfig;
	export type UserConfig = import('vite').UserConfig;
	export type Input = import('vite').ResolvedConfig['build']['rollupOptions']['input'];
	export type OutDir = import('vite').ResolvedConfig['build']['outDir'];
	export type Plugin = import('vite').PluginOption;
	/**
	 * v4wp options
	 */
	export type V4wpOptions = {
		/**
		 * Entry points (optional, defaults to 'src/main.js'). See https://rollupjs.org/configuration-options/#input
		 */
		input?: Input | undefined;
		/**
		 * Output directory (optional, defaults to 'dist'). See https://vitejs.dev/config/build-options.html#build-outdir
		 */
		outDir?: OutDir | undefined;
	};
}

declare module '@kucrut/vite-for-wp/plugins' {
	export function dev_server(options?: DevServerOptions): import('vite').Plugin;
	/**
	 * Dev Server Options
	 */
	type DevServerOptions = {
		/**
		 * Path to directory where the dev server manifest should be stored. Defaults to the value of `build.outDir` option.
		 */
		manifest_dir?: string | undefined;
	};
	export function wp_scripts(options?: WPScriptsOptions): Plugin;
	type Plugin = import('vite').PluginOption;
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
}

declare module '@kucrut/vite-for-wp/utils' {
	export function camel_case_dash(str: string): string;
	export function choose_port(options: ChoosePortOptions): Promise<number>;
	/**
	 * choose_port options
	 */
	type ChoosePortOptions = {
		/**
		 * Host name or IP address, defaults to 'localhost'.
		 */
		host?: string | undefined;
		/**
		 * Preferred port number, defaults to 5173
		 */
		port?: number | undefined;
	};
	export function wp_globals(): Record<string, string>;
}

//# sourceMappingURL=index.d.ts.map