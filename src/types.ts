import { ResolvedConfig } from 'vite';

export type Input = ResolvedConfig['build']['rollupOptions']['input'];

export interface ChoosePortOptions {
	/**
	 * @default localhost
	 * @description Host name or IP address, defaults to 'localhost'.
	 */
	host?: string
	/**
	 * @default 5173
	 * @description Preferred port number, defaults to 5173.
	 */
	port?: number
}

export interface DevServerOptions {
	/**
	 * @description Path to directory where the dev server manifest should be stored. Defaults to the value of `build.outDir` option.
	 */
	manifest_dir?: string;
}

export interface V4wpOptions {
	/**
	 * @description Entry points (optional, defaults to 'src/main.js'). See https://rollupjs.org/configuration-options/#input
	 */
	input?: Input;
	/**
	 * @description Output directory (optional, defaults to 'dist'). See https://vitejs.dev/config/build-options.html#build-outdir
	 */
	outDir?: ResolvedConfig['build']['outDir'];
}
