import pool from '../lib/db.js';

export async function listar() {
  const { rows } = await pool.query('SELECT * FROM pacientes ORDER BY id ASC');
  return rows;
}

export async function crear(paciente) {
  const { rows } = await pool.query(
    'SELECT * FROM registrar_paciente($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [
      paciente.nombre,
      paciente.especie,
      String(paciente.edad),
      paciente.diagnostico,
      paciente.imagen,
      paciente.peso,
      paciente.dueno,
      paciente.telefono,
      paciente.ultima_visita,
    ],
  );

  return rows[0];
}
