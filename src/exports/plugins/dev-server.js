import { mergeConfig } from 'vite';
import { choose_port } from '../utils/choose-port.js';

/**
 * Dev server plugin
 *
 * @type {() => import('vite').Plugin}
 * @return {import('vite').Plugin} Plugin object.
 */
export function dev_server() {
	return {
		apply: 'serve',
		name: 'v4wp:dev-server',

		async config( config ) {
			const { server = {} } = config;
			let { host = 'localhost', port = 5173, ...rest_server } = server;

			// We need actual host name or IP address for choose_port() to work.
			if ( typeof host === 'boolean' ) {
				host = '0.0.0.0';
			}

			const hmr_protocol = rest_server.https ? 'wss' : 'ws';
			const server_protocol = rest_server.https ? 'https' : 'http';

			// Ensure chosen port is available because we need to enable strictPort below.
			// If the chosen port is already in use, a free one will be selected.
			port = await choose_port( { host, port } );

			// This will be used by the PHP helper.
			const origin = `${ server_protocol }://${ host }:${ port }`;

			return mergeConfig( config, {
				server: {
					...rest_server,
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
			} );
		},
	};
}
