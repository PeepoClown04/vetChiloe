import * as repositorio from '../repositories/pacientes.js';
import {
  ESPECIES, IMAGEN_MAX_BYTES, IMAGEN_TIPOS,
  normalizarRut, normalizarTelefono, validarPaciente,
} from '../domain/validaciones.js';

export const ESPECIES_VALIDAS = ESPECIES;

export class ErrorValidacion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorValidacion';
  }
}

export async function obtenerPacientes() {
  return repositorio.listar();
}

export async function registrarPaciente(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new ErrorValidacion('Los datos del paciente deben ser un objeto.');
  }
  const errores = validarPaciente(datos);
  if (Object.keys(errores).length) {
    throw new ErrorValidacion(Object.values(errores).join(' '));
  }
  if (datos.diagnostico != null && typeof datos.diagnostico !== 'string') {
    throw new ErrorValidacion('El diagnóstico debe ser texto.');
  }
  if (datos.imagen != null) {
    const imagen = datos.imagen;
    const base64 = typeof imagen === 'string'
      ? imagen.match(/^data:(image\/[a-z]+);base64,([A-Za-z0-9+/]+={0,2})$/)
      : null;
    const esURL = typeof imagen === 'string'
      && ['https:', 'http:'].includes(URL.parse(imagen)?.protocol);
    if (!esURL && (!base64 || !IMAGEN_TIPOS.includes(base64[1]) || base64[2].length % 4 !== 0)) {
      throw new ErrorValidacion('La imagen debe ser una URL HTTP(S) o una fotografía JPG, PNG, WEBP, GIF o AVIF en base64.');
    }
    if (base64 && Buffer.from(base64[2], 'base64').length > IMAGEN_MAX_BYTES) {
      throw new ErrorValidacion('La imagen no puede superar 2 MB.');
    }
  }
  return repositorio.crear({
    nombre: datos.nombre.trim(),
    especie: datos.especie,
    peso: Number(datos.peso),
    edad: Number(datos.edad),
    dueno: normalizarRut(datos.dueno),
    telefono: normalizarTelefono(datos.telefono),
    diagnostico: datos.diagnostico ?? null,
    ultima_visita: datos.ultima_visita,
    imagen: datos.imagen ?? null,
  });
}
