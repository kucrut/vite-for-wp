<?php
/**
 * Vite integration for WordPress Yo!
 *
 * @package ViteForWp
 */

declare( strict_types=1 );

namespace Kucrut\Vite;

use Exception;

const VITE_CLIENT_SCRIPT_HANDLE = 'vite-client';

/**
 * Get manifest data
 *
 * @since 1.0.0
 *
 * @param string $manifest_dir Path to manifest directory.
 *
 * @throws Exception Exception is thrown when the file doesn't exist, unreadble, or contains invalid data.
 *
 * @return object Object containing manifest type and data.
 */
function get_manifest( string $manifest_dir): object {
	// Avoid repeatedly opening & decoding the same file.
	static $manifests = [];

	$file_names = [ 'manifest', 'vite-dev-server' ];

	foreach ( $file_names as $file_name ) {
		$is_dev = $file_name === 'vite-dev-server';
		$manifest_path = "{$manifest_dir}/{$file_name}.json";

		if ( isset( $manifests[ $manifest_path ] ) ) {
			return $manifests[ $manifest_path ];
		}

		if ( is_readable( $manifest_path ) ) {
			break;
		}

		unset( $manifest_path );
	}

	if ( ! isset( $manifest_path ) ) {
		throw new Exception( sprintf( '[Vite] No manifest found in %s.', $manifest_dir ) );
	}

	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$manifest_content = file_get_contents( $manifest_path );

	if ( ! $manifest_content ) {
		throw new Exception( sprintf( '[Vite] Failed to read manifest %s.', $manifest_path ) );
	}

	$manifest = json_decode( $manifest_content );

	if ( json_last_error() ) {
		throw new Exception( sprintf( '[Vite] Manifest %s contains invalid data.', $manifest_path ) );
	}

	/**
	 * Filter manifest data
	 *
	 * @param array  $manifest      Manifest data.
	 * @param string $manifest_dir  Manifest directory path.
	 * @param string $manifest_path Manifest file path.
	 * @param bool   $is_dev        Whether this is a manifest for development assets.
	 */
	$manifest = apply_filters( 'vite_for_wp__manifest_data', $manifest, $manifest_dir, $manifest_path );

	$manifests[ $manifest_path ] = (object) [
		'data' => $manifest,
		'dir' => $manifest_dir,
		'is_dev' => $is_dev,
	];

	return $manifests[ $manifest_path ];
}

/**
 * Filter script tag
 *
 * This creates a function to be used as callback for the `script_loader` filter
 * which adds `type="module"` attribute to the script tag.
 *
 * @since 1.0.0
 *
 * @param string $handle Script handle.
 *
 * @return void
 */
function filter_script_tag( string $handle ): void {
	add_filter( 'script_loader_tag', fn ( ...$args ) => set_script_type_attribute( $handle, ...$args ), 10, 3 );
}

/**
 * Add `type="module"` to a script tag
 *
 * @since 1.0.0
 *
 * @param string $target_handle Handle of the script being targeted by the filter callback.
 * @param string $tag           Original script tag.
 * @param string $handle        Handle of the script that's currently being filtered.
 *
 * @return string Script tag with attribute `type="module"` added.
 */
function set_script_type_attribute( string $target_handle, string $tag, string $handle ): string {
	if ( $target_handle !== $handle ) {
		return $tag;
	}

	$attribute = 'type="module"';
	$script_type_regex = '/type=(["\'])([\w\/]+)(["\'])/';

	if ( preg_match( $script_type_regex, $tag ) ) {
		// Pre-HTML5.
		$tag = preg_replace( $script_type_regex, $attribute, $tag );
	} else {
		$tag = preg_replace( '#(<script)(.*></script>)#', sprintf( '$1 %s$2', $attribute ), $tag );
	}

	return $tag;
}

/**
 * Generate development asset src
 *
 * @since 1.0.0
 *
 * @param object $manifest Asset manifest.
 * @param string $entry    Asset entry name.
 *
 * @return string
 */
function generate_development_asset_src( object $manifest, string $entry ): string {
	return sprintf(
		'%s/%s',
		untrailingslashit( $manifest->data->origin ),
		trim( preg_replace( '/[\/]{2,}/', '/', "{$manifest->data->base}/{$entry}" ), '/' )
	);
}

/**
 * Register vite client script
 *
 * @since 1.0.0
 *
 * @param object $manifest Asset manifest.
 *
 * @return void
 */
function register_vite_client_script( object $manifest ): void {
	if ( wp_script_is( VITE_CLIENT_SCRIPT_HANDLE ) ) {
		return;
	}

	$src = generate_development_asset_src( $manifest, '@vite/client' );

	// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	wp_register_script( VITE_CLIENT_SCRIPT_HANDLE, $src, [], null, false );
	filter_script_tag( VITE_CLIENT_SCRIPT_HANDLE );
}

/**
 * Get react refresh script preamble
 *
 * @param string $src React refresh script source URL.
 * @return string
 */
function get_react_refresh_script_preamble( string $src ): string {
	$script = <<< EOS
import RefreshRuntime from "{$src}";
RefreshRuntime.injectIntoGlobalHook(window);
window.__VITE_IS_MODERN__ = true;
window.\$RefreshReg$ = () => {};
window.\$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
EOS;

	return $script;
}

/**
 * Load development asset
 *
 * @since 1.0.0
 *
 * @param object $manifest Asset manifest.
 * @param string $entry    Entrypoint to enqueue.
 * @param array  $options  Enqueue options.
 *
 * @return array|null Array containing registered scripts or NULL if the none was registered.
 */
function load_development_asset( object $manifest, string $entry, array $options ): ?array {
	register_vite_client_script( $manifest );

	$dependencies = array_merge(
		[ VITE_CLIENT_SCRIPT_HANDLE ],
		$options['dependencies']
	);

	if ( in_array( 'vite:react-refresh', $manifest->data->plugins, true ) ) {
		$react_refresh_script_src = generate_development_asset_src( $manifest, '@react-refresh' );
		wp_add_inline_script(
			VITE_CLIENT_SCRIPT_HANDLE,
			get_react_refresh_script_preamble( $react_refresh_script_src ),
			'after'
		);
	}

	$src = generate_development_asset_src( $manifest, $entry );

	filter_script_tag( $options['handle'] );

	// This is a development script, browsers shouldn't cache it.
	// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	if ( ! wp_register_script( $options['handle'], $src, $dependencies, null, $options['in-footer'] ) ) {
		return null;
	}

	$assets = [
		'scripts' => [ $options['handle'] ],
		'styles' => $options['css-dependencies'],
	];

	/**
	 * Filter registered development assets
	 *
	 * @param array  $assets   Registered assets.
	 * @param object $manifest Manifest object.
	 * @param string $entry    Entrypoint file.
	 * @param array  $options  Enqueue options.
	 */
	$assets = apply_filters( 'vite_for_wp__development_assets', $assets, $manifest, $entry, $options );

	return $assets;
}

/**
 * Load production asset
 *
 * @since 1.0.0
 *
 * @param object $manifest Asset manifest.
 * @param string $entry    Entrypoint to enqueue.
 * @param array  $options  Enqueue options.
 *
 * @return array|null Array containing registered scripts & styles or NULL if there was an error.
 */
function load_production_asset( object $manifest, string $entry, array $options ): ?array {
	$url = content_url( str_replace( WP_CONTENT_DIR, '', $manifest->dir ) ); // TODO.

	if ( ! isset( $manifest->data->{$entry} ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			wp_die( esc_html( sprintf( '[Vite] Entry %s not found.', $entry ) ) );
		}

		return null;
	}

	$assets = [
		'scripts' => [],
		'styles' => [],
	];
	$item = $manifest->data->{$entry};
	$src = "{$url}/{$item->file}";

	if ( ! $options['css-only'] ) {
		filter_script_tag( $options['handle'] );

		// Don't worry about browser caching as the version is embedded in the file name.
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		if ( wp_register_script( $options['handle'], $src, $options['dependencies'], null, $options['in-footer'] ) ) {
			$assets['scripts'][] = $options['handle'];
		}
	}

	if ( ! empty( $item->css ) ) {
		foreach ( $item->css as $index => $css_file_path ) {
			$style_handle = "{$options['handle']}-{$index}";

			// Don't worry about browser caching as the version is embedded in the file name.
			// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
			if ( wp_register_style( $style_handle, "{$url}/{$css_file_path}", $options['css-dependencies'], null, $options['css-media'] ) ) {
				$assets['styles'][] = $style_handle;
			}
		}
	}

	/**
	 * Filter registered production assets
	 *
	 * @param array  $assets   Registered assets.
	 * @param object $manifest Manifest object.
	 * @param string $entry    Entrypoint file.
	 * @param array  $options  Enqueue options.
	 */
	$assets = apply_filters( 'vite_for_wp__production_assets', $assets, $manifest, $entry, $options );

	return $assets;
}

/**
 * Parse register/enqueue options
 *
 * @since 1.0.0
 *
 * @param array $options Array of options.
 *
 * @return array Array of options merged with defaults.
 */
function parse_options( array $options ): array {
	$defaults = [
		'css-dependencies' => [],
		'css-media' => 'all',
		'css-only' => false,
		'dependencies' => [],
		'handle' => '',
		'in-footer' => false,
	];

	return wp_parse_args( $options, $defaults );
}

/**
 * Register asset
 *
 * @since 1.0.0
 *
 * @see load_development_asset
 * @see load_production_asset
 *
 * @param string $manifest_dir Path to directory containing manifest file, usually `build` or `dist`.
 * @param string $entry        Entrypoint to enqueue.
 * @param array  $options      Enqueue options.
 *
 * @return array
 */
function register_asset( string $manifest_dir, string $entry, array $options ): ?array {
	try {
		$manifest = get_manifest( $manifest_dir );
	} catch ( Exception $e ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			wp_die( esc_html( $e->getMessage() ) );
		}

		return null;
	}

	$options = parse_options( $options );
	$assets = $manifest->is_dev
		? load_development_asset( $manifest, $entry, $options )
		: load_production_asset( $manifest, $entry, $options );

	return $assets;
}

/**
 * Enqueue asset
 *
 * @since 1.0.0
 *
 * @see register_asset
 *
 * @param string $manifest_dir Path to directory containing manifest file, usually `build` or `dist`.
 * @param string $entry        Entrypoint to enqueue.
 * @param array  $options      Enqueue options.
 *
 * @return bool
 */
function enqueue_asset( string $manifest_dir, string $entry, array $options ): bool {
	$assets = register_asset( $manifest_dir, $entry, $options );

	if ( is_null( $assets ) ) {
		return false;
	}

	$map = [
		'scripts' => 'wp_enqueue_script',
		'styles' => 'wp_enqueue_style',
	];

	foreach ( $assets as $group => $handles ) {
		$func = $map[ $group ];

		foreach ( $handles as $handle ) {
			$func( $handle );
		}
	}

	return true;
}
