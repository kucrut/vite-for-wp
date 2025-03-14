import { ResolvedConfig } from 'vite';

export type Input = ResolvedConfig['build']['rollupOptions']['input'];

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
