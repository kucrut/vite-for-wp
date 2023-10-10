import { camel_case_dash } from './camel-case-dash.js';

/**
 * Get all global variables registered by WordPress
 *
 * @type {() => Record<string, string>}
 * @return {Record<string, string>} Object containing global variable names registered by WordPress.
 */
export function wp_globals() {
	const wpModules = [
		'a11y',
		'annotations',
		'api-fetch',
		'autop',
		'blob',
		'block-directory',
		'block-editor',
		'block-library',
		'block-serialization-default-parser',
		'blocks',
		'components',
		'compose',
		'core-data',
		'customize-widgets',
		'data',
		'data-controls',
		'date',
		'deprecated',
		'dom',
		'dom-ready',
		'edit-post',
		'edit-site',
		'edit-widgets',
		'editor',
		'element',
		'escape-html',
		'format-library',
		'hooks',
		'html-entities',
		'i18n',
		'is-shallow-equal',
		'keyboard-shortcuts',
		'keycodes',
		'list-reusable-blocks',
		'media-utils',
		'notices',
		'nux',
		'plugins',
		'preferences',
		'preferences-persistence',
		'primitives',
		'priority-queue',
		'redux-routine',
		'reusable-blocks',
		'rich-text',
		'server-side-render',
		'shortcode',
		'style-engine',
		'token-list',
		'url',
		'viewport',
		'warning',
		'widgets',
		'wordcount',
	];

	const otherModules = {
		'jquery': 'jQuery',
		'tinymce': 'tinymce',
		'moment': 'moment',
		'react': 'React',
		'react-dom': 'ReactDOM',
		'backbone': 'Backbone',
		'lodash': 'lodash',
	};

	return {
		...otherModules,
		...Object.fromEntries(
			wpModules.map( handle => [ `@wordpress/${ handle }`, `wp.${ camel_case_dash( handle ) }` ] ),
		),
	};
}
