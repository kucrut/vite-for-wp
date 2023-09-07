/** @typedef {{ host?: string; port: number; }} ChoosePortOptions */

import { createServer } from 'net';

/**
 * Choose port
 *
 * Stolen from vite.
 *
 * @type {(options: ChoosePortOptions) => Promise<number>}
 * @param {ChoosePortOptions} options Options.
 * @return {Promise<number>}  Chosen port.
 */
export async function choose_port( options = { port: 3000, host: 'localhost' } ) {
	const server = createServer();

	return new Promise( ( resolve, reject ) => {
		let { port, host } = options;

		/** @param {Error & { code?: string }} e */
		const onError = e => {
			if ( e.code === 'EADDRINUSE' ) {
				server.listen( ++port, host );
			} else {
				server.removeListener( 'error', onError );
				reject( e );
			}
		};

		server.on( 'error', onError );

		server.listen( port, host, () => {
			server.removeListener( 'error', onError );
			server.close();
			resolve( port );
		} );
	} );
}
