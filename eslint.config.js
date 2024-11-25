import configs from '@kucrut/eslint-config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
	...ts.configs.recommended,
	...configs.js,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
	{
		ignores: [ '.pnpm-store/*', 'php/*', 'pnpm-lock.yaml', 'types/*', 'vendor/*' ],
	},
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
	},
];
