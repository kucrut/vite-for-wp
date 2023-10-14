import fs from 'fs';

/**
 * Development server manifest plugin
 *
 * @type {() => import('vite').Plugin}
 * @return {import('vite').Plugin} Plugin object.
 */
export function dev_server_manifest() {
	const plugins_to_check = [ 'vite:react-refresh' ];
	/** @type {string} */
	let dev_manifest_file;

	return {
		apply: 'serve',
		name: 'v4wp:dev-server-manifest',

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

			dev_manifest_file = build.outDir + '/vite-dev-server.json';

			fs.mkdirSync( build.outDir, { recursive: true } );
			fs.writeFileSync( dev_manifest_file, JSON.stringify( data ), 'utf8' );
		},

		configureServer( server ) {
			server.httpServer?.once( 'close', () => {
				fs.rmSync( dev_manifest_file );
			} );
		},
	};
}
