import { camel_case_dash } from './camel-case-dash.js';

/**
 * Get all global scripts registered by WordPress
 *
 * @type {() => Record<string, string>}
 * @return {Record<string, string>} Object containing global script names registered by WordPress.
 */
export function wp_globals() {
	const wp_modules = [
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
		'commands',
		'components',
		'compose',
		'core-commands',
		'core-data',
		'customize-widgets',
		'data-controls',
		'data',
		'date',
		'deprecated',
		'dom-ready',
		'dom',
		'edit-post',
		'edit-site',
		'edit-widgets',
		'editor',
		'element',
		'escape-html',
		'fields',
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
		'patterns',
		'plugins',
		'preferences-persistence',
		'preferences',
		'primitives',
		'priority-queue',
		'private-apis',
		'redux-routine',
		'reusable-blocks',
		'rich-text',
		'router',
		'server-side-render',
		'shortcode',
		'style-engine',
		'token-list',
		'undo-manager',
		'url',
		'viewport',
		'warning',
		'widgets',
		'wordcount',
	];

	const other_modules = {
		'jquery': 'jQuery',
		'tinymce': 'tinymce',
		'moment': 'moment',
		'react': 'React',
		'react-dom': 'ReactDOM',
		'backbone': 'Backbone',
		'lodash': 'lodash',
	};

	return {
		...other_modules,
		...Object.fromEntries( wp_modules.map( handle => [
			`@wordpress/${ handle }`,
			`wp.${ camel_case_dash( handle ) }`,
		] ) ),
	};
}
