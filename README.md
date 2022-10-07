# Vite for WordPress

[Vite](https://vitejs.dev) integration for WordPress plugins and themes development.

## Usage

Let's assume we have this plugin files structure:

```
my-plugin/
├ js/
| └ src/
|   └ main.ts
├ package.json
├ plugin.php
└ vite.config.js
```

### JavaScript

Add JS dependencies:

```sh
npm add -D vite @kucrut/vite-for-wp
```

Create `vite.config.js`:

```js
import create_config from '@kucrut/vite-for-wp';

export default create_config( 'js/src/main.ts', 'js/dist' );
```

If you have multiple entrypoints to build, pass an object as the first parameter:

```js
// vite.config.js
import create_config from '@kucrut/vite-for-wp';

export default create_config(
	{
		main: 'js/src/main.ts',
		extra: 'js/src/extra.ts',
	},
	'js/dist',
);
```

Pass a [configuration object](https://vitejs.dev/config/) as the third parameter if you need to add plugins, use https, etc:

```js
// vite.config.js
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import create_config from '@kucrut/vite-for-wp';
import react from '@vitejs/plugin-react';

export default create_config( 'js/src/main.ts', 'js/dist', {
	plugins: [ react() ],
	server: {
		host: 'mydomain.com',
		https: {
			cert: readFileSync( 'path/to/cert.pem' ),
			key: readFileSync( 'path/to/key.pem' ),
		},
	},
} );
```

Lastly, add `dev` and `build` scripts to your `package.json`:

```json
{
	"scripts": {
		"build": "vite build",
		"dev": "vite"
	}
}
```

### PHP

Add the composer dependency:

```sh
composer require kucrut/vite-for-wp
```

If your plugin/theme doesn't use composer, feel free to copy [the main file](https://github.com/kucrut/vite-for-wp/blob/main/vite-for-wp.php) and require it.

Enqueue the script:

```php
<?php

use Kucrut\Vite;

add_action( 'wp_enqueue_scripts', function (): void {
	Vite\enqueue_asset(
		__DIR__ . 'js/dist',
		'js/src/main.ts',
		[
			'handle' => 'my-script-handle',
			'dependencies' => [ 'wp-components', 'some-registered-script-handle' ], // Optional script dependencies. Defaults to empty array.
			'css-dependencies' => [ 'wp-components', 'some-registered-style-handle' ], // Optional style dependencies. Defaults to empty array.
			'css-media' => 'all', // Optional.
			'css-only' => false, // Optional. Set to true to only load style assets in production mode.
			'in-footer' => true, // Optional. Defaults to false.
		]
	);
} );
```

Note that each entrypoint needs to be enqueued separately, ie. if you have multiple entrypoints, you'll need to call `Vite\enqueue_asset()` for each and every one of them.

To only register the asset, use `Vite\register_asset()`. It accepts same parameters as `Vite\enqueue_asset()` and returns an array of scripts and styles handles that you can enqueue later using `wp_enqueue_script()` and `wp_enqueue_style()`. Please note that style assets are only registered in production mode because in development mode, they will be automatically loaded by Vite.

You can now run `npm run dev` when developing your plugin/theme and run `npm run build` to build the production assets.

## Notes

### External Dependencies

If your JS package depends on one or more WordPress modules (eg. `@wordpress/i18n`), you can define them as externals with the help of `rollup-plugin-external-globals`.

```sh
npm add -D rollup-plugin-external-globals
```

```js
// vite.config.js
import { wp_globals } from '@kucrut/vite-for-wp/utils';
import create_config from '@kucrut/vite-for-wp';
import external_globals from 'rollup-plugin-external-globals';

export default create_config( 'js/src/main.ts', 'js/dist', {
	plugins: [
		external_globals( {
			...wp_globals(),
			'some-registered-script-handle': 'GlobalVar',
		} ),
	],
} );
```

Note that you will need to add them to the `dependencies` array when enqueueing the script (see example above).

## Example plugins

-   React: https://github.com/kucrut/vite-for-wp-example-react
-   Svelte: https://github.com/kucrut/catatan

## Limitations

Currently, this package doesn't provide HMR support for building editor blocks yet.

## License

[GPL v2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
