/**
 * Given a kebab-case string, returns a new camelCase string.
 *
 * @type {(str: string) => string}
 * @param {string} str Input kebab-case string.
 * @return {string} Camel-cased string.
 */
export function camel_case_dash( str ) {
	return str.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );
}
