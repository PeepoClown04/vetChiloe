const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim().replace(/\/+$/, '');
const BASE_URL = `${API_ORIGIN}/api/pacientes`;

const pedir = async (url, opciones) => {
  const respuesta = await fetch(url, opciones);
  const cuerpo = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(cuerpo?.error ?? `La API respondió con un error ${respuesta.status}.`);
  }

  return cuerpo;
};

export function obtenerPacientes() {
  return pedir(BASE_URL);
}

export function obtenerResumen() {
  return pedir(`${BASE_URL}/resumen`);
}

export function registrarPaciente(paciente) {
  return pedir(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paciente),
  });
}
