import Layer from 'express/lib/router/layer';

export const asynchronously = options => (
  assign(asynchronously, options), reporter
);

const {assign, defineProperty} = Object;

/** Proxy handler.apply @internal */
const apply = async (target, thisArg, args) => {
  try {
    return await Reflect.apply(target, thisArg, args);
  } catch (exception) {
    args[args.length - 1](exception);
  }
};

/** Internal Layer.prototype.handler hook @internal */
function initialize() {
  let use = handle => (asynchronously.enabled ? enable(handle) : handle);

  /** @see https://github.com/davidbanham/express-async-errors */
  defineProperty(Layer.prototype, 'handle', {
    configurable: true,
    get() {},
    set(handle) {
      'function' === typeof handle &&
        defineProperty(this, 'handle', {value: use(handle), writable: true});
    },
  });

  /* DEFAULTS */
  asynchronously.enabled = asynchronously.send = asynchronously.log = true;

  return (initialize = asynchronously);

  function enable(handle) {
    const handlers = new Map();
    const handler = {apply};

    defineProperty(asynchronously, 'enabled', {value: true, writable: false});

    enable = use = handle =>
      handlers.get(handle) ||
      (handlers.set(handle, (handle = new Proxy(handle, handler))) &&
        handlers.set(handle, handle) &&
        handle);

    return use(handle);
  }
}

export const reporter = (error, request, response, next) => {
  if (asynchronously.send)
    response.status(500).send(`<pre>${error.stack || error}</pre>`);
  if (asynchronously.log || !asynchronously.send)
    console.warn(`[Caught] ${error}`);
  next();
};

export const testware = ({originalUrl}, response, next) => {
  if (originalUrl === '/testware/throws') throw Error(originalUrl);
  else if (originalUrl === '/testware/rejects')
    return Promise.reject(Error(originalUrl));
};

asynchronously.testware = testware;

export default initialize();
