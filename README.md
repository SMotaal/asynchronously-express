# Asynchronously Express *(experimental)*

Pure async functions as Express middleware


| ⚠️ Experimental use only <details> requires `--experimental-modules` flag
|-

## Usage

```js
import express from 'express';
import asynchronously from 'asynchronously-express';

const app = express();

app.use(
  // (optional) testware
  asynchronously.testware,

  /* async middleware here */

  // (finally) reporter
  asynchronously({log: true, send: truem, enabled: true}),
);
```

## Options

#### enabled `boolean`
  toggles the patch for debugging

  > can only disable before `app.use()` is called

#### send `boolean`
  sends formatted response

#### log `boolean`
  toggles the patch for debugging

  > always on if send is off

## Gotchas

- app.use() call must follow the asynchronously() call

## Inspiration

- https://github.com/davidbanham/express-async-errors
- https://github.com/MadRabbit/express-yields
