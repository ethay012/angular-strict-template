/* eslint-env es6 */
const glob = require('glob')
const PurgecssPlugin = require('purgecss-webpack-plugin')

module.exports = {
    plugins: [
      new PurgecssPlugin({
        paths: glob.sync(`src/**/*`,  { nodir: true }),
      }),
    ]
  };