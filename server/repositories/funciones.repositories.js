import pool from '../lib/db.js';

export async function buscar(texto) {
  const { rows } = await pool.query(
    'SELECT * FROM buscar_pacientes($1)',
    [texto],
  );

  return rows;
}

export async function resumen() {
  const { rows } = await pool.query('SELECT * FROM resumen_por_especie()');

  return rows.map((fila) => ({ especie: fila.especie, total: Number(fila.total) }));
}
