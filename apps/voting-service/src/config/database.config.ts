import { Options } from '@mikro-orm/core';

import path from 'path';

const database: Options = {
  type: 'postgresql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USER || 'voting_svc',
  password: process.env.DATABASE_PASSWORD || 'bitcapital',
  dbName: process.env.DATABASE_NAME || 'voting_svc_database',
  migrations: {
    path: path.resolve(__dirname, '../migrations/'),
    pattern: /^[\w-]+\d+\.(ts|js)$/,
  },
};

export default () => ({ database });
