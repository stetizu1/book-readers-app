import { Express } from 'express';
import { startAuthor } from './authorRoute';

export const startRoutes = (app: Express): void => {
  startAuthor(app);
};
