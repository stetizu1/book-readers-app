import { Pool } from 'pg';

import { DbEnv } from '../constants/env/Database';


export const pool = new Pool({
  connectionString: DbEnv.DATABASE_URL,
  ssl: DbEnv.SSL,
});
