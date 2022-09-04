import { sync } from 'glob';
import PurgecssPlugin from 'purgecss-webpack-plugin';

import { Configuration } from 'webpack';

export default {
  plugins: [
    new PurgecssPlugin({
      paths: () => sync('src/**/*', { nodir: true })
    })
  ]
} as Configuration;
