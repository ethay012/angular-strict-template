import { sync } from 'glob';
import { readFileSync } from 'fs';
import PurgecssPlugin from 'purgecss-webpack-plugin';

import { Configuration } from 'webpack';

const PRIMENG_MODULE_NAME_GROUP_INDEX = 1;
const PRIMENG_MODULE_IMPORT_REGEX = /import .*primeng\/([a-zA-Z]*)/g;
const PRIMENG_MODULE_IMPORT_FILE_PATTERN = 'src/**/*.module.ts';

function findMatches(
  regex: RegExp,
  content: string,
  matches: RegExpExecArray[] = []
) {
  const regexMatches = regex.exec(content);
  if (regexMatches) {
    matches.push(regexMatches);
    findMatches(regex, content, matches);
  }

  return matches;
}

function getImportedPrimeNgModuleNames(): string[] {
  const uniquePrimeNgImports = new Set<string>();
  sync(PRIMENG_MODULE_IMPORT_FILE_PATTERN, { nodir: true }).forEach((file) => {
    const fileContents = readFileSync(file, { encoding: 'utf8' });
    const matches = findMatches(PRIMENG_MODULE_IMPORT_REGEX, fileContents);
    if (matches.length > 0) {
      for (const match of matches) {
        uniquePrimeNgImports.add(match[PRIMENG_MODULE_NAME_GROUP_INDEX]);
      }
    }
  });

  return Array.from(uniquePrimeNgImports);
}

export default {
  plugins: [
    new PurgecssPlugin({
      paths: () => {
        const importedPrimeNgModuleNames = getImportedPrimeNgModuleNames();

        const filePaths = [
          'src/**/*',
          ...importedPrimeNgModuleNames.map(
            (moduleName) =>
              `node_modules/primeng/esm2020/${moduleName}/${moduleName}.mjs`
          )
        ];

        return filePaths.flatMap((path) =>
          sync(path, {
            nodir: true
          })
        );
      },
      keyframes: true,
      fontFace: true
    })
  ]
} as Configuration;
