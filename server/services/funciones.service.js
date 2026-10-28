import * as repositorio from '../repositories/funciones.repositories.js';

export async function buscar(texto) {
  return repositorio.buscar(String(texto ?? '').trim());
}

export async function resumen() {
  return repositorio.resumen();
}
