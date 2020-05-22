/**
 * This uses customize-cra to work around the standard CRA config which does not support TypeScript in symlinked dependencies
 * (book-app-shared in this case)
 */
const {
  removeModuleScopePlugin,
  override,
  babelInclude,
} = require('customize-cra');
const path = require('path');

module.exports = override(
  removeModuleScopePlugin(),
  babelInclude([path.resolve('src'), path.resolve('../shared')])
);
