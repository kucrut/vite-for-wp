declare module '@kucrut/vite-for-wp' {
	export function v4wp(options: Options): import('vite').PluginOption[];
	export default function create_config(input: InputOption, out_dir: string, extra_config?: ExtraConfig): UserConfig;
	export type ResolvedConfig = import('vite').ResolvedConfig;
	export type UserConfig = import('vite').UserConfig;
	export type ExtraConfig = Record<string, any>;
	export type InputOption = ResolvedConfig['build']['rollupOptions']['input'];
	export type Options = {
		input?: InputOption;
		outDir?: ResolvedConfig['build']['outDir'];
	};
}

declare module '@kucrut/vite-for-wp/plugins' {
	export function dev_server(): import('vite').Plugin;
	export function wp_scripts(options?: Options): import('vite').PluginOption[];
	type Options = {
		extraScripts?: Record<string, string>;
	};
}

declare module '@kucrut/vite-for-wp/utils' {
	export function camel_case_dash(str: string): string;
	export function choose_port(options: ChoosePortOptions): Promise<number>;
	type ChoosePortOptions = {
		host?: string;
		port: number;
	};
	export function wp_globals(): Record<string, string>;
}

//# sourceMappingURL=index.d.ts.map