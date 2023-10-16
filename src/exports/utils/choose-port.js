import { createServer } from 'net';

/**
 * choose_port options
 *
 * @typedef ChoosePortOptions
 *
 * @property {string=} [host=localhost] Host name or IP address, defaults to 'localhost'.
 * @property {number=} [port=5173]      Preferred port number, defaults to 5173
 */

/**
 * Choose port
 *
 * Stolen from vite.
 *
 * @type {(options: ChoosePortOptions) => Promise<number>}
 * @param {ChoosePortOptions} options Options.
 * @return {Promise<number>}  Chosen port.
 */
export async function choose_port( options = {} ) {
	const server = createServer();

	return new Promise( ( resolve, reject ) => {
		let { host = 'localhost', port = 5173 } = options;

		/** @param {Error & { code?: string }} error */
		const handle_error = error => {
			if ( error.code === 'EADDRINUSE' ) {
				server.listen( ++port, host );
			} else {
				server.removeListener( 'error', handle_error );
				reject( error );
			}
		};

		server.on( 'error', handle_error );

		server.listen( port, host, () => {
			server.removeListener( 'error', handle_error );
			server.close();
			resolve( port );
		} );
	} );
}
