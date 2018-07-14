import express from 'express';

/* EXPORTS */
export default asynchronously;

/** Convenience method to set options and return reporting middleware */
export const asynchronously: Asynchronously;

/** Error reporting middleware */
export const reporter: Reporter;

/** Debug tracing middleware */
export const tracer: Tracer;

/** Testing middleware */
export const testware: Testware;

/* INTERFACES */

export interface Asynchronously extends Options {
  /** Convenience method to set options and return reporting middleware */
  (options?: Options): [Reporter, Tracer];

  /** Error reporting middleware */
  reporter: Reporter;

  /** Debug tracing middleware */
  tracer: Tracer;

  /** Testing middleware */
  testware: Testware;
}

export interface Options {
  /**
   * Set to false to (somewhat) disable before app.use() calls take place
   * @default {true}
   */
  enabled?: boolean;

  /**
   * Set to true to output detailed logs to terminal
   * @default {true}
   */
  log?: boolean;

  /**
   * Set to false to defer all feedback to terminal
   * @default {true}
   */
  send?: boolean;

  /**
   * Set to true to output middleware call trace to terminal
   * @default {false}
   */
  debug?: boolean;
}

export interface Reporter extends express.ErrorRequestHandler {}

export interface Tracer extends express.RequestHandler {}

export interface Testware extends express.RequestHandler {}
