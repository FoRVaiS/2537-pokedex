// @ts-check

const common = {
  'strict': 0,

  'space-before-function-paren': 0,
  'no-extra-parens': 0,

  'indent': [1, 2],
  'curly': 0,
  'multiline-comment-style': 0,
  'no-restricted-syntax': 0,

  'max-classes-per-file': 0,
  'class-methods-use-this': 0,
  'new-cap': 0,
  'newline-per-chained-call': 0,
  'prefer-destructuring': ['error', {
    'VariableDeclarator': {
      'array': false,
      'object': true,
    },
  }],

  'linebreak-style': [1, 'unix'],
};

const nodeRules = {
  ...common,
};

const browserRules = {
  ...common,
};

module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  ignorePatterns: ['node_modules/'],
  extends: [
    '@forvais/eslint-config-base',
  ],
  overrides: [
    // Node
    {
      env: {
        node: true,
        jest: true,
      },
      files: ['./**/*.js'],
      extends: [
        '@forvais/eslint-config-node',
      ],
      rules: nodeRules,
    },

    // Browser
    {
      env: {
        browser: true,
      },
      files: ['./public/**/*.js'],
      rules: browserRules,
    },
  ],
};
