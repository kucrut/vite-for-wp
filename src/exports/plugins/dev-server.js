import fs from 'node:fs';
import { choose_port } from '../utils/choose-port.js';

/**
 * Dev server plugin
 *
 * @type {() => import('vite').Plugin}
 * @return {import('vite').Plugin} Plugin object.
 */
export function dev_server() {
	const plugins_to_check = [ 'vite:react-refresh' ];
	/** @type {string} */
	let dev_manifest_data;
	/** @type {string} */
	let dev_manifest_file;

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
			const { base, build, plugins, server } = config;
			const prod_manifest_file = build.outDir + '/manifest.json';

			// Remove build manifest as the PHP helper uses it to determine
			// which manifest to load when enqueueing assets.
			fs.rmSync( prod_manifest_file, { force: true } );

			const data = {
				base,
				origin: server.origin,
				port: server.port,
				plugins: plugins_to_check.filter( i => plugins.some( ( { name } ) => name === i ) ),
			};

			dev_manifest_data = JSON.stringify( data );
			dev_manifest_file = build.outDir + '/vite-dev-server.json';

			fs.mkdirSync( build.outDir, { recursive: true } );
		},

		configureServer( { httpServer } ) {
			if ( ! httpServer ) {
				return;
			}

			httpServer.on( 'listening', () => {
				fs.writeFileSync( dev_manifest_file, dev_manifest_data, 'utf8' );
			} );

			httpServer.on( 'close', () => {
				fs.rmSync( dev_manifest_file, { force: true } );
			} );
		},
	};
}
