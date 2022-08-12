# Vite for WordPress

## Usage

### JavaScript

From your JS package, add the dependency:

```sh
npm add -D @kucrut/vite-for-wp
```

Create `vite.config.js`:

```js
import create_config from '@kucrut/vite-for-wp';

export default create_config( 'js/src/main.ts', 'js/dist' );
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

add_action( 'wp_enqueue_scripts', function () {
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
