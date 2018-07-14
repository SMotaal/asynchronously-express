# Asynchronously Express _(experimental)_

Pure async functions as Express middleware

| ⚠️ Experimental use only <details> requires `--experimental-modules` flag
|-

## Usage

Please keep in mind that the current paching method is not suited for selective patching. That said, below are different ways that you might want to experiment with.

```js
import express from 'express';
import asynchronously from 'asynchronously-express';

const app = express();

OPTION1:
  // This is the only call to app.use()
  app.use(
    // (optional)
    asynchronously.testware,

    /* wrapped middleware here */

    asynchronously({/* { see options  }*/}),
    // (returns) [reporter, tracer]
  );

OPTION1:
  /** @type {[express.ErrorRequestHandler, express.RequestHandler]} **/
  const reporters = asynchronously({/* { see options  }*/});

  /* … all app methods will be wrapped  */

  // This is the last call to app.use()
  app.use(reporters);
```

## Options

#### enabled `boolean`

toggles the patch for debugging

> can only disable before `app.use()` is called

#### send `boolean`

sends formatted response

#### log `boolean`

outputs details errors to terminal

> always on if send is off

#### debug `boolean`

outputs each request handling traces to terminal

## Gotchas

- app.use() call must follow the asynchronously() call

## Inspiration

- https://github.com/davidbanham/express-async-errors
- https://github.com/MadRabbit/express-yields
