/**
 * Given a kebab-case string, returns a new camelCase string.
 *
 * @param {string} str Input kebab-case string.
 * @return {string} Camel-cased string.
 */
export default function camel_case_dash( str: string ): string {
	return str.replace( /-([a-z])/g, ( match, letter ) => letter.toUpperCase() );
}
