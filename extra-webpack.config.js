/* eslint-env es6 */
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
    module: {
      rules: [
        {
          test: /\.scss$/i,
          use: [
            "sass-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    purgecss({
                        content: ['./src/**/*.html'],
                      })
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  };