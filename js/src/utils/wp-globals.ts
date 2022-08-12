import camel_case_dash from './camel-case-dash';

type WPGlobals = {
	[ key: string ]: string | string[];
};

export default function wp_globals(): WPGlobals {
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
		'data',
		'data-controls',
		'date',
		'deprecated',
		'dom',
		'dom-ready',
		'edit-post',
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
		'primitives',
		'priority-queue',
		'redux-routine',
		'reusable-blocks',
		'rich-text',
		'server-side-render',
		'shortcode',
		'token-list',
		'url',
		'viewport',
		'warning',
		'wordcount',
	];

	const otherModules = {
		'wp': 'wp',
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
			wpModules.map( handle => [ `@wordpress/${ handle }`, [ 'wp', camel_case_dash( handle ) ] ] ),
		),
	};
}
