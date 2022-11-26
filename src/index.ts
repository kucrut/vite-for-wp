// See https://vitejs.dev/config/

import { mergeConfig, type ResolvedConfig, type UserConfig } from 'vite';

import { dev_server_config, dev_server_manifest } from './plugins';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtraConfig = Record< string, any >;
type InputOption = ResolvedConfig[ 'build' ][ 'rollupOptions' ][ 'input' ];

/**
 * Create vite config
 *
 * @param {InputOption}  input        Input file(s).
 * @param {string}       out_dir      Output directory.
 * @param {ExtraConfig=} extra_config Extra configuration.
 *
 * @return {UserConfig}  Vite configuration object.
 */
export default function create_config( input: InputOption, out_dir: string, extra_config?: ExtraConfig ): UserConfig {
	let config: UserConfig = {
		base: './',
		build: {
			emptyOutDir: true,
			manifest: true,
			modulePreload: false,
			outDir: out_dir,
			rollupOptions: { input },
			sourcemap: true,
		},
		css: {
			devSourcemap: true,
		},
		plugins: [ dev_server_config(), dev_server_manifest() ],
	};

	if ( extra_config ) {
		config = mergeConfig( config, extra_config );
	}

	return config;
}
