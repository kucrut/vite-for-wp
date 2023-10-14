/* global process:false */

import fs from 'fs';

/**
 * Development server manifest plugin
 *
 * @type {() => import('vite').Plugin}
 * @return {import('vite').Plugin} Plugin object.
 */
export function dev_server_manifest() {
	const pluginsToCheck = [ 'vite:react-refresh' ];
	/** @type {string} */
	let devManifestFile;

	return {
		apply: 'serve',
		name: 'v4wp:dev-server-manifest',

		configResolved( config ) {
			const { base, build, plugins, server } = config;

			const data = {
				base,
				origin: server.origin,
				port: server.port,
				plugins: pluginsToCheck.filter( i => plugins.some( ( { name } ) => name === i ) ),
			};

			if ( ! fs.existsSync( build.outDir ) ) {
				fs.mkdirSync( build.outDir );
			}

			const prodManifestFile = build.outDir + '/manifest.json';

			// Remove build manifest as the PHP helper uses it to determine
			// which manifest to load when enqueueing assets.
			if ( fs.existsSync( prodManifestFile ) ) {
				fs.rmSync( prodManifestFile );
			}

			devManifestFile = build.outDir + '/vite-dev-server.json';

			fs.writeFileSync( devManifestFile, JSON.stringify( data ), 'utf8' );
		},

		configureServer( server ) {
			server.httpServer?.once( 'close', () => {
				fs.rmSync( devManifestFile );
			} );
		},
	};
}
