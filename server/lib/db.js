import { Pool, types } from 'pg';
import 'dotenv/config';

types.setTypeParser(1082, (valor) => valor);
types.setTypeParser(1700, (valor) => Number.parseFloat(valor));

const host = URL.parse(process.env.DATABASE_URL ?? '')?.hostname;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ['localhost', '127.0.0.1', '[::1]'].includes(host)
    ? false
    : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

export default pool;
