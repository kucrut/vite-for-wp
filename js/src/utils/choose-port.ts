import { createServer } from 'net';

export type ChoosePortOptions = {
	host?: string;
	port: number;
};

/**
 * Choose port
 *
 * Stolen from vite.
 *
 * @param {ChoosePortOptions} options Options.
 * @return {Promise<number>}  Chosen port.
 */
export default async function choose_port(
	options: ChoosePortOptions = { port: 3000, host: 'localhost' },
): Promise< number > {
	const server = createServer();

	return new Promise( ( resolve, reject ) => {
		let { port, host } = options;

		const onError = ( e: Error & { code?: string } ) => {
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
