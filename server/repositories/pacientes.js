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

export async function listar() {
  const { rows } = await pool.query('SELECT * FROM pacientes ORDER BY id ASC');
  return rows;
}

export async function crear(paciente) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL lock_timeout = '10s'");
    await client.query('LOCK TABLE pacientes IN SHARE ROW EXCLUSIVE MODE');
    const year = new Date().getFullYear();
    const { rows: numeros } = await client.query(`
      SELECT (COALESCE(MAX(SUBSTRING(numero_atencion FROM 6)::bigint), 0) + 1)::text AS siguiente
      FROM pacientes WHERE numero_atencion ~ $1
    `, [`^${year}-[0-9]+$`]);
    const numero = `${year}-${numeros[0].siguiente.padStart(3, '0')}`;
    const { rows } = await client.query(`
      INSERT INTO pacientes
        (nombre, especie, peso, dueno, telefono, numero_atencion, edad, diagnostico, ultima_visita, imagen)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
    `, [
      paciente.nombre, paciente.especie, paciente.peso, paciente.dueno,
      paciente.telefono, numero, paciente.edad, paciente.diagnostico,
      paciente.ultima_visita, paciente.imagen,
    ]);
    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
