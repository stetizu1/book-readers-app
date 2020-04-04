module.exports = {
    extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
    },
    env: {
        browser: true,
        node: true,
    },
    rules: {
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/interface-name-prefix': 0,
        'jsx-a11y/label-has-associated-control': [2, { assert: 'either' }],
        'import/prefer-default-export': 0,
        'max-classes-per-file': 0,
        'max-len': 0,
        'no-console': [2, { allow: ['error'] }], // allow console.error during development
        'react/prop-types': 0,
        'react/react-in-jsx-scope': 0,
        'react/jsx-props-no-spreading': 0,
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['packages/frontend/src'],
            },
        },
    },
};
