import axios from 'axios';

import { ServerEnv } from 'app/constants/env/Server';

export const config = {
  baseURL: ServerEnv.SERVER_BASE_URL,
  timeout: ServerEnv.TIMEOUT,
};

export const api = axios.create(config);
