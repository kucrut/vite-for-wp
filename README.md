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
import { v4wp } from '@kucrut/vite-for-wp';

export default {
	plugins: [
		v4wp( {
			input: 'js/src/main.ts', // Optional, defaults to 'src/main.js'.
			outDir: 'js/dist', // Optional, defaults to 'dist'.
		} ),
	],
};
```

For multiple entrypoints, pass an object as the first parameter:

```js
// vite.config.js
import { v4wp } from '@kucrut/vite-for-wp';

export default {
	plugins: [
		v4wp( {
			input: {
				main: 'js/src/main.ts',
				extra: 'js/src/extra.ts',
			},
			outDir: 'js/dist',
		} ),
	],
};
```

Refer to Rollup documentation on how to set entrypoints: https://rollupjs.org/configuration-options/#input

Feel free to [customise the configuration](https://vitejs.dev/config/) to add plugins, use https, etc:

```js
// vite.config.js
import { readFileSync } from 'node:fs';
import { v4wp } from '@kucrut/vite-for-wp';
import react from '@vitejs/plugin-react';

export default {
	plugins: [ v4wp( { input: 'js/src/main.ts', outDir: 'js/dist' } ), react() ],
	server: {
		host: 'mydomain.com',
		https: {
			cert: readFileSync( 'path/to/cert.pem' ),
			key: readFileSync( 'path/to/key.pem' ),
		},
	},
};
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
		__DIR__ . '/js/dist',
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

If your package depends on one or more scripts registered by WordPress (eg. `jquery`, `react`, `@wordpress/i18n`, etc.) and you want to exclude them from the final build, add `wp_scripts()` to the list of Vite's plugins. But first, install the required dependencies:

```sh
npm add -D rollup-plugin-external-globals vite-plugin-external
```

For example, to externalise `react` and `react-dom` packages:

```js
// vite.config.js
import { v4wp } from '@kucrut/vite-for-wp';
import { wp_scripts } from '@kucrut/vite-for-wp/plugins';
import react from '@vitejs/plugin-react';

export default {
	plugins: [
		v4wp( {
			input: 'js/src/main.jsx',
			outDir: 'js/dist',
		} ),
		wp_scripts(),
		react( {
			jsxRuntime: 'classic',
		} ),
	],
};
```

**Special Notes for React**

-   `react` and `react-dom` packages still need to be installed as your package's dev dependencies as they're used by `@vitejs/plugin-react`.
-   `react` and `react-dom` should be added to the `dependencies` array when enqueueing the script (see example above).

## Example plugins

-   React: https://github.com/kucrut/vite-for-wp-example-react
-   Svelte: https://github.com/kucrut/vite-for-wp-example-svelte
-   Vanilla JS: https://github.com/kucrut/vite-for-wp-example-vanilla-js
-   Vue: https://github.com/kucrut/vite-for-wp-example-vue

## Limitations

Currently, this package doesn't provide HMR support for building editor blocks yet.

## License

[GPL v2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
