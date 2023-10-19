import { choose_port } from '../utils/choose-port.js';
import { join } from 'node:path';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

/**
 * Dev Server Options
 *
 * @typedef DevServerOptions
 *
 * @property {string=} manifest_dir Path to directory where the dev server manifest should be stored. Defaults to the value of `build.outDir` option.
 */

/**
 * Dev server plugin
 *
 * @since 0.1.0
 * @since 0.8.0 Accept options.
 *
 * @type {(options?: DevServerOptions) => import('vite').Plugin}
 *
 * @param {DevServerOptions=} options Plugin options.
 * @return {import('vite').Plugin} Plugin object.
 */
export function dev_server( options = {} ) {
	const plugins_to_check = [ 'vite:react-refresh' ];
	/** @type {string} */
	let manifest_file;
	/** @type {import('vite').ResolvedConfig} */
	let resolved_config;

	return {
		apply: 'serve',
		name: 'v4wp:dev-server',

		async config( config ) {
			const { server = {} } = config;
			let { host = 'localhost', port = 5173, ...server_config } = server;

			// We need actual host name or IP address for choose_port() to work.
			if ( typeof host === 'boolean' ) {
				host = '0.0.0.0';
			}

			const hmr_protocol = server_config.https ? 'wss' : 'ws';
			const server_protocol = server_config.https ? 'https' : 'http';

			// Ensure chosen port is available because we need to enable strictPort below.
			// If the chosen port is already in use, a free one will be selected.
			port = await choose_port( { host, port } );

			// This will be used by the PHP helper.
			const origin = `${ server_protocol }://${ host }:${ port }`;

			return {
				server: {
					...server_config,
					host,
					origin,
					port,
					strictPort: true,
					hmr: {
						port,
						host,
						protocol: hmr_protocol,
					},
				},
			};
		},

		configResolved( config ) {
			resolved_config = config;
		},

		buildStart() {
			const { base, build, plugins, server } = resolved_config;

			const data = JSON.stringify( {
				base,
				origin: server.origin,
				port: server.port,
				plugins: plugins_to_check.filter( i => plugins.some( ( { name } ) => name === i ) ),
			} );

			const manifest_dir = options.manifest_dir || build.outDir;
			manifest_file = join( manifest_dir, 'vite-dev-server.json' );

			mkdirSync( manifest_dir, { recursive: true } );
			writeFileSync( manifest_file, data, 'utf8' );
		},

		buildEnd() {
			rmSync( manifest_file, { force: true } );
		},
	};
}
