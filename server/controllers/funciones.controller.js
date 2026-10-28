import * as funcionesService from '../services/funciones.service.js';

export async function buscar(req, res) {
  res.status(200).json(await funcionesService.buscar(req.query.q ?? ''));
}

export async function resumen(req, res) {
  res.status(200).json(await funcionesService.resumen());
}
