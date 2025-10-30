module.exports = {
  extends: 'next',
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    /**
     * Just ignore this rule for now during the migration of shadcnblocks
     */
    '@next/next/no-img-element': 'off',
  },
}
