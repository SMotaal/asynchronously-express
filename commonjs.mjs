import Module from 'module';

const cache = Module._cache;

/** @type {(path: string) => string[]} */
export const nodeModulePaths = path => Module._nodeModulePaths(path);

/** @type {string[]} */
const currentPath = process.cwd();
const currentPaths = nodeModulePaths(currentPath);
const Protocol = /^((?:file|https?):)\/\//;
const pathname = string => Protocol[Symbol.replace](`${string}`, '');

export const resolve = (specifier, referrer) => {
  let resolved,
    paths,
    path = referrer;

  if ((resolved = !path && specifier in cache && cache[specifier].filename))
    return resolved;

  path = (!path && resolve.path) || pathname(path);
  paths =
    (path && path !== resolve.path && nodeModulePaths(path)) || resolve.paths;
  resolved = Module._findPath(specifier, paths, false);

  // console.log('commonjs.resolve(%o, %o) => %o', specifier, referrer, {
  //   path,
  //   paths,
  //   resolved,
  // });

  return resolved;
};

resolve.path = currentPath;
resolve.paths = currentPaths;

export const require = (specifier, referrer) =>
  Module._load(resolve(specifier, referrer), process.mainModule, false);

require.resolve = resolve;

export default require;
