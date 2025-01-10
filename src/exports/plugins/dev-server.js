import { choose_port } from '../utils/choose-port.js';
import { join } from 'node:path';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import net from 'node:net';

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

		async config( userConfig ) {
			const userServer = userConfig.server ?? {}

			let {
				host = 'localhost',
				port = 5173,
				origin,            // If origin is not set, it will be generated from host and port
				hmr: userHmr = {},
				...server_config   // https, headers, strictPort, etc.
			} = userServer

			// We need actual host name or IP address for choose_port() to work.
			if ( typeof host === 'boolean' ) {
				host = '0.0.0.0';
			}

			const hmr_protocol = server_config.https ? 'wss' : 'ws';
			const server_protocol = server_config.https ? 'https' : 'http';

			// Check if strictPort is enabled and if the chosen port is already in use.
			if (server_config.strictPort) {
				const inUse = await is_port_in_use(port, host);
				if (inUse) {
					throw new Error(`Port ${port} already in use on ${host}`);
				}
			} else {
				// Ensure chosen port is available because we need to enable strictPort below.
				// If the chosen port is already in use, a free one will be selected.
				port = await choose_port( { host, port } );
			}

      		const finalOrigin =
				typeof origin === 'string'
				? origin
				: `${server_protocol}://${host}:${port}`

			// Use user-defined values if they exist, otherwise use the defaults
			const finalHmr = {
				...userHmr,
				port: userHmr.port ?? port,
				host: userHmr.host ?? host,
				protocol: userHmr.protocol ?? hmr_protocol,
			}

			return {
				server: {
					...server_config,
					host,
					origin: finalOrigin,
					port,
					strictPort: true,
					hmr: finalHmr,
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

/**
 * Check if port is busy.
 * @author David Mussard <david.mussard@gmail.com>
 * @param {number} port
 * @param {string} host
 * @returns {Promise<boolean>}
 */
async function is_port_in_use(port, host = '127.0.0.1') {
	return new Promise((resolve) => {
		const server = net.createServer();
		
		server.once('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				resolve(true);  // Port is busy
			} else {
				resolve(false);
			}
		});
		
		server.once('listening', () => {
			server.close();
			resolve(false);  // Port is free
		});
		
		server.listen(port, host);
	});
}
