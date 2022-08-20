# Vite for WordPress

## Usage

### JavaScript

From your JS package, add the dependencies:

```sh
npm add -D vite @kucrut/vite-for-wp
```

Create `vite.config.js`:

```js
import create_config from '@kucrut/vite-for-wp';

export default create_config( 'js/src/main.ts', 'js/dist' );
```

Pass a configuration object as the third parameter if you need to add plugins, use https, etc:

```js
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

### Plugin/theme

Add the composer dependency:

```sh
composer require kucrut/vite-for-wp
```

Enqueue the script:

```php
<?php

use Kucrut\Vite;

add_action( 'wp_enqueue_scripts', function (): void {
	Vite\enqueue_asset(
		__DIR__ . 'js/dist',
		'src/main.ts',
		[
			'handle' => 'my-script-handle',
			'dependencies' => [ 'wp-components', 'wp-edit-post' ], // Optional.
			'css-dependencies' => [ 'wp-components', 'wp-edit-post' ], // Optional.
			'in-footer' => true, // Optional.
		]
	);
} );
```

To only register the asset (and enqueue it later), use `Vite\register_asset()`. It accepts same parameters as `Vite\enqueue_asset()`.

## Limitations

Currently, this package doesn't provide HMR support for building editor blocks yet.

## License

[GPL v2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
