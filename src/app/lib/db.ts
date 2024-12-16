import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:PecuSpecu1@localhost:5432/postgres',
});


export default pool;