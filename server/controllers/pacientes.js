import { ErrorValidacion, obtenerPacientes, registrarPaciente } from '../services/pacientes.js';

export async function listar(req, res) {
  res.status(200).json(await obtenerPacientes());
}

export async function crear(req, res) {
  try {
    res.status(201).json(await registrarPaciente(req.body));
  } catch (error) {
    if (error instanceof ErrorValidacion) {
      res.status(400).json({ error: error.message });
      return;
    }

    throw error;
  }
}
