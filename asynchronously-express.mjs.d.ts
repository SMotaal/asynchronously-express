import express from 'express';

/**
 * Asynchronously Express (experimental)
 *
 * see {README.md} for more details
 */
export const asynchronously: (options: object) => express.ErrorRequestHandler;

/** Reporting middleware */
export const reporter: express.ErrorRequestHandler;

/** Example testware */
export const testware: express.RequestHandler;

export default asynchronously;
