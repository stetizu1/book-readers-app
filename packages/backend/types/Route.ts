import { Express } from 'express';

export type Route = (app: Express) => void;
