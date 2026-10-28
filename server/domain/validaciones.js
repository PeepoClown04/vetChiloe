export const ESPECIES = ['Canino', 'Felino', 'Ave', 'Roedor', 'Reptil', 'Otro'];
export const PESO_MIN = 0.1;
export const PESO_MAX = 200;
export const EDAD_MIN = 0;
export const EDAD_MAX = 99;
export const NOMBRE_MIN = 2;
export const NOMBRE_MAX = 40;

const SOLO_LETRAS = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

export const IMAGEN_MAX_MB = 2;
export const IMAGEN_MAX_BYTES = IMAGEN_MAX_MB * 1024 * 1024;
export const IMAGEN_TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export const hoyISO = () => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

export const limpiarRut = (rut) => String(rut).replace(/[.\-\s]/g, '').toUpperCase();

export const calcularDv = (cuerpo) => {
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
};

export const validarRut = (rut) => {
  const limpio = limpiarRut(rut);
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return calcularDv(cuerpo) === dv;
};

export const normalizarRut = (rut) => {
  const limpio = limpiarRut(rut);
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`;
};

const soloDigitos = (valor) => String(valor).replace(/\D/g, '');

export const validarTelefono = (telefono) => {
  const d = soloDigitos(telefono);
  return /^56[2-9]\d{8}$/.test(d) || /^9\d{8}$/.test(d);
};

export const normalizarTelefono = (telefono) => {
  const d = soloDigitos(telefono);
  return d.startsWith('56') ? `+${d}` : `+56${d}`;
};

export const validarImagen = (archivo) => {
  if (!archivo) return '';
  if (!IMAGEN_TIPOS.includes(archivo.type)) {
    return 'Formato no permitido: usa JPG, PNG, WEBP, GIF o AVIF.';
  }
  if (archivo.size > IMAGEN_MAX_BYTES) {
    return `La imagen no puede superar ${IMAGEN_MAX_MB} MB.`;
  }
  return '';
};

export const validarPaciente = (datos = {}) => {
  const errores = {};

  const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : '';
  if (!nombre) errores.nombre = 'El nombre es obligatorio.';
  else if (nombre.length < NOMBRE_MIN) errores.nombre = `Mínimo ${NOMBRE_MIN} caracteres.`;
  else if (nombre.length > NOMBRE_MAX) errores.nombre = `Máximo ${NOMBRE_MAX} caracteres.`;
  else if (!SOLO_LETRAS.test(nombre)) errores.nombre = 'Solo letras, espacios, guiones y apóstrofes.';

  if (!ESPECIES.includes(datos.especie)) errores.especie = 'Selecciona una especie.';

  const peso = ['string', 'number'].includes(typeof datos.peso) ? Number(datos.peso) : NaN;
  if (!['string', 'number'].includes(typeof datos.peso) || String(datos.peso).trim() === '') errores.peso = 'El peso es obligatorio.';
  else if (!Number.isFinite(peso)) errores.peso = 'El peso debe ser un número.';
  else if (peso <= 0) errores.peso = 'El peso debe ser mayor que 0.';
  else if (peso < PESO_MIN) errores.peso = `El peso mínimo es ${PESO_MIN} kg.`;
  else if (peso > PESO_MAX) errores.peso = `El peso máximo es ${PESO_MAX} kg.`;

  const edad = ['string', 'number'].includes(typeof datos.edad) ? Number(datos.edad) : NaN;
  if (!['string', 'number'].includes(typeof datos.edad) || String(datos.edad).trim() === '') errores.edad = 'La edad es obligatoria.';
  else if (!Number.isInteger(edad)) errores.edad = 'La edad debe ser un número entero.';
  else if (edad < EDAD_MIN) errores.edad = 'La edad no puede ser negativa.';
  else if (edad > EDAD_MAX) errores.edad = `La edad máxima es ${EDAD_MAX} años.`;

  if (typeof datos.dueno !== 'string' || !datos.dueno.trim()) errores.dueno = 'El RUT es obligatorio.';
  else if (!validarRut(datos.dueno)) errores.dueno = 'RUT inválido: revisa el dígito verificador.';

  if (typeof datos.telefono !== 'string' || !datos.telefono.trim()) errores.telefono = 'El teléfono es obligatorio.';
  else if (!validarTelefono(datos.telefono)) errores.telefono = 'Teléfono inválido. Ej: +56912345678';

  const fecha = datos.ultima_visita;
  if (!fecha) errores.ultima_visita = 'La fecha es obligatoria.';
  else if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
    || !Number.isFinite(Date.parse(`${fecha}T00:00:00Z`))
    || new Date(`${fecha}T00:00:00Z`).toISOString().slice(0, 10) !== fecha) {
    errores.ultima_visita = 'La fecha no es válida.';
  } else if (fecha > hoyISO()) errores.ultima_visita = 'La fecha no puede ser futura.';

  return errores;
};

export const tieneErrores = (errores) => Object.keys(errores).length > 0;
