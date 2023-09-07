declare module '@kucrut/vite-for-wp' {
	export default function create_config(input: InputOption, out_dir: string, extra_config?: ExtraConfig): UserConfig;
	export type ResolvedConfig = import('vite').ResolvedConfig;
	export type UserConfig = import('vite').UserConfig;
	export type ExtraConfig = Record<string, any>;
	export type InputOption = ResolvedConfig['build']['rollupOptions']['input'];
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