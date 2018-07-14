// import Layer from 'express/lib/router/layer';
import require from './commonjs.mjs';
import util from 'util';

const {
  assign,
  defineProperty,
  defineProperties,
  getOwnPropertyDescriptors,
} = Object;

const {log, warn} = console;

const warnings = [],
  traces = [];

const asynchronously = options => {
  dump(warnings, warn);
  assign(asynchronously, options);
  return [reporter, tracer];
};

const dump = (queue, method = log) => {
  if (!queue || !queue.length) return;
  for (const args of queue.splice(0, queue.length)) method(...[].concat(args));
}; //  = logs

/** Proxy handler.apply @internal */
const apply = async (target, thisArg, args, alias = target.name) => {
  const length = args.length;
  const next = args[length - 1];
  const request = args[length - 3];
  const log = (asynchronously.debug && []) || false;
  let result;
  try {
    if (log) {
      (request.logs || (request.logs = [])).push(log);
    }
    result = await Reflect.apply(target, thisArg, args);
  } catch (exception) {
    result = exception;
  } finally {
    if (log) {
      args.length === 4
        ? log.push(`async<${alias}>(%O, …) => %O`, args[0], result)
        : log.push(`async<${alias}>(…) => %O`, result);
    }
    result === undefined || next(result);
  }
};

/** Internal Layer.prototype.handler hook @internal */
function initialize() {
  let use = handle => (asynchronously.enabled ? enable(handle) : handle);

  /* DEFAULTS */
  asynchronously.enabled = asynchronously.send = asynchronously.log = true;

  /* PATCH */
  // TODO: Explore finer-grained patching options
  const layer = 'express/lib/router/layer';
  try {
    const Layer = require(require.resolve(layer));
    /** @see https://github.com/davidbanham/express-async-errors */
    defineProperty(Layer.prototype, 'handle', {
      configurable: true,
      get() {},
      set(handle) {
        'function' === typeof handle &&
          defineProperty(this, 'handle', {value: use(handle), writable: true});
      },
    });
  } catch (exception) {
    warnings.push([
      `Could not resolve %o which is required for asynchronously-express to function.`,
      layer,
    ]);
    return;
  }

  return (initialize = asynchronously);

  function enable(handle) {
    const handlers = new Map([[reporter, reporter]]);
    const handler = {apply};

    defineProperty(asynchronously, 'enabled', {value: true, writable: false});
    const proxy = handle => {
      const length = handle.length;
      const name = `${handle.name ||
        (length === 4 && '<error handler>') ||
        (length === 3 && '<request handler>') ||
        '<middleware>'}`;
      const proxy = defineProperties(
        (...args) => apply(handle, null, args, name),
        {
          ...getOwnPropertyDescriptors(handle),
          name: {value: name},
        },
      );
      return proxy;
    };

    enable = use = handle =>
      handlers.get(handle) ||
      (handlers.set(handle, (handle = proxy(handle))) &&
        handlers.set(handle, handle) &&
        handle);

    return use(handle);
  }
}

export function reporter(error, request, response, next) {
  if (!error) return next();
  if (!asynchronously.send && !asynchronously.log) return next(error);
  const {type = 'Error', message = error || 'Internal Error', stack} = error;
  const body = stack || message;
  if (asynchronously.send) {
    response.status(500).format({
      text: () => response.send(body),
      html: () => response.send(`<pre>${body}</pre>`),
      json: () => response.send({[type]: {message, stack}}),
    });
    if (asynchronously.log !== false) log(`[Sent]: ${type}: ${message}`);
  } else {
    warn(`[Unhandled]: %O`, error);
  }
  next();
}

export async function tracer(request, response, next) {
  next();
  dump(request.logs);
}

export function testware({originalUrl}, response, next) {
  if (originalUrl === '/testware/throws') throw Error(originalUrl);
  else if (originalUrl === '/testware/rejects')
    return Promise.reject(Error(originalUrl));
  next();
}

asynchronously.testware = testware;
asynchronously.reporter = reporter;
asynchronously.tracer = tracer;

initialize();

export {asynchronously};

export default asynchronously;
