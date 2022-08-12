import type { Plugin } from 'vite';

import { choose_port } from '../utils/';

const SERVER_HOST = 'localhost';
const SERVER_PORT = 5173;

export default function dev_server_config(): Plugin {
	return {
		apply: 'serve',
		name: 'hm-dev-server',

		async config( config ) {
			const port = await choose_port( { host: SERVER_HOST, port: SERVER_PORT } );
			const origin = `http://${ SERVER_HOST }:${ port }`;

			return {
				...config,
				server: {
					...( config.server || {} ),
					origin,
					port,
					host: SERVER_HOST,
					strictPort: true,
					hmr: {
						port,
						host: SERVER_HOST,
						protocol: 'ws',
					},
				},
			};
		},
	};
}
