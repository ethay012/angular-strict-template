import { normalize } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  strings,
  Tree,
  url
} from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import {
  buildDefaultPath,
  getWorkspace
} from '@schematics/angular/utility/workspace';

interface Options {
  name: string;
  path: string;
  project: string;
  flat: boolean;
  skipTests: boolean;
}

export function component(_options: Options): Rule {
  return ruleFactory(_options, 'component');
}

export function directive(_options: Options): Rule {
  return ruleFactory(_options, 'directive');
}

export function pipe(_options: Options): Rule {
  return ruleFactory(_options, 'pipe');
}

function ruleFactory(options: Options, type: string) {
  return async (tree: Tree) => {
    const rules = [externalSchematic('@ngneat/aim', type, options)];

    if (!options.skipTests) {
      rules.push(await createSpec(tree, options, type));
    }

    return chain(rules);
  };
}

async function createSpec(tree: Tree, options: Options, type: string) {
  const workspace = await getWorkspace(tree);

  if (!options.project) {
    options.project = workspace.extensions.defaultProject as string;
  }

  const project = workspace.projects.get(options.project);

  if (!project) {
    throw new SchematicsException(
      `Project '${options.project}' does not exist.`
    );
  }

  if (options.path === undefined && project) {
    options.path = buildDefaultPath(project);
  }

  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;

  const templateSource = apply(url(`./files/${type}`), [
    applyTemplates({
      classify: strings.classify,
      dasherize: strings.dasherize,
      name: options.name
    }),
    move(
      normalize(
        `/${options.path}/${
          options.flat ? '' : strings.dasherize(options.name)
        }`
      )
    )
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}
