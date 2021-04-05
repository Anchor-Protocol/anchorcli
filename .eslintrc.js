module.exports = {
  extends: [
    '@ssen',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/no-anonymous-default-export': 'off'
  },
};
