import { useRef, useState } from 'react';
import './FormularioPaciente.css';
import {
  EDAD_MAX,
  EDAD_MIN,
  ESPECIES,
  NOMBRE_MAX,
  PESO_MAX,
  PESO_MIN,
  hoyISO,
  normalizarRut,
  normalizarTelefono,
  tieneErrores,
  validarImagen,
  validarPaciente,
} from '../utils/validaciones';

function FormularioPaciente({ onAgregarPacientes, onCerrar }) {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [peso, setPeso] = useState('');
  const [dueno, setDueno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [edad, setEdad] = useState('');
  const [ultimaVisita, setUltimaVisita] = useState('');
  const [imagen, setImagen] = useState(null);
  const [nombreImagen, setNombreImagen] = useState('');

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState('');
  const envioEnCurso = useRef(false);

  const inputArchivoRef = useRef(null);

  const limpiarFormulario = () => {
    setNombre('');
    setEspecie('');
    setPeso('');
    setDueno('');
    setTelefono('');
    setEdad('');
    setUltimaVisita('');
    setImagen(null);
    setNombreImagen('');
    setErrores({});

    if (inputArchivoRef.current) inputArchivoRef.current.value = '';
  };

  const limpiarError = (campo) => {
    setErrores((previos) => {
      if (!previos[campo]) return previos;
      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  };

  const marcarError = (campo, mensaje) => {
    setErrores((previos) => ({ ...previos, [campo]: mensaje }));
  };

  const cambiar = (setter, campo) => (evento) => {
    setter(evento.target.value);
    limpiarError(campo);
  };

  const manejarImagen = (evento) => {
    const archivo = evento.target.files[0];
    limpiarError('imagen');

    if (!archivo) {
      setImagen(null);
      setNombreImagen('');
      return;
    }

    const error = validarImagen(archivo);

    if (error) {
      marcarError('imagen', error);
      setImagen(null);
      setNombreImagen('');
      evento.target.value = '';
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      setImagen(lector.result);
      setNombreImagen(archivo.name);
    };
    lector.readAsDataURL(archivo);
  };

  const quitarImagen = () => {
    setImagen(null);
    setNombreImagen('');
    limpiarError('imagen');
    if (inputArchivoRef.current) inputArchivoRef.current.value = '';
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    if (envioEnCurso.current) return;

    const erroresEncontrados = validarPaciente({
      nombre,
      especie,
      peso,
      dueno,
      telefono,
      edad,
      ultima_visita: ultimaVisita,
    });

    if (tieneErrores(erroresEncontrados)) {
      setErrores(erroresEncontrados);
      return;
    }

    envioEnCurso.current = true;
    setGuardando(true);
    setErrorGuardado('');
    try {
      await onAgregarPacientes({
        nombre: nombre.trim(), especie, peso: Number(peso),
        dueno: normalizarRut(dueno), telefono: normalizarTelefono(telefono),
        edad: Number(edad), ultima_visita: ultimaVisita, imagen: imagen ?? null,
      });
      limpiarFormulario();
      onCerrar?.();
    } catch (error) {
      setErrorGuardado(error.message || 'No se pudo registrar el paciente. Intenta nuevamente.');
    } finally {
      envioEnCurso.current = false;
      setGuardando(false);
    }
  };

  const propsCampo = (campo, extra = '') => ({
    className: ['campo', errores[campo] ? 'campo--error' : '', extra]
      .filter(Boolean)
      .join(' '),
    'aria-invalid': errores[campo] ? 'true' : undefined,
    'aria-describedby': errores[campo] ? `error-${campo}` : undefined,
  });

  const mensajeError = (campo) =>
    errores[campo] ? (
      <p className="mensaje-error" id={`error-${campo}`}>
        {errores[campo]}
      </p>
    ) : null;

  return (
    <section className="formulario-paciente" id="formulario-paciente">
      <h2 id="titulo-modal">Registro de Nuevo Paciente</h2>

      <form onSubmit={manejarSubmit} autoComplete="off" noValidate aria-busy={guardando}>
        <fieldset disabled={guardando}>
        <div {...propsCampo('nombre')}>
          <label htmlFor="nombre">Nombre del Paciente</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={cambiar(setNombre, 'nombre')}
            placeholder="Ej: Charkicito"
            maxLength={NOMBRE_MAX}
            required
          />
          {mensajeError('nombre')}
        </div>

        <div {...propsCampo('especie')}>
          <label htmlFor="especie">Especie</label>
          <select
            id="especie"
            name="especie"
            value={especie}
            onChange={cambiar(setEspecie, 'especie')}
            required
          >
            <option value="">Selecciona una especie…</option>
            {ESPECIES.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
          {mensajeError('especie')}
        </div>

        <div {...propsCampo('edad')}>
          <label htmlFor="edad">Edad (años)</label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={edad}
            onChange={cambiar(setEdad, 'edad')}
            min={EDAD_MIN}
            max={EDAD_MAX}
            step="1"
            placeholder="Ej: 5"
            required
          />
          {mensajeError('edad')}
        </div>

        <div {...propsCampo('peso')}>
          <label htmlFor="peso">Peso (kg)</label>
          <input
            type="number"
            id="peso"
            name="peso"
            value={peso}
            onChange={cambiar(setPeso, 'peso')}
            min={PESO_MIN}
            max={PESO_MAX}
            step="0.1"
            placeholder="Ej: 4.5"
            required
          />
          {mensajeError('peso')}
        </div>

        <div {...propsCampo('dueno')}>
          <label htmlFor="dueno">RUT del Dueño</label>
          <input
            type="text"
            id="dueno"
            name="dueno"
            value={dueno}
            onChange={cambiar(setDueno, 'dueno')}
            placeholder="Ej: 11111111-1"
            maxLength={12}
            required
          />
          {mensajeError('dueno')}
        </div>

        <div {...propsCampo('telefono')}>
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={telefono}
            onChange={cambiar(setTelefono, 'telefono')}
            placeholder="Ej: +56912345678"
            maxLength={13}
            required
          />
          {mensajeError('telefono')}
        </div>

        <div {...propsCampo('ultima_visita')}>
          <label htmlFor="ultima_visita">Fecha de Última Visita</label>
          <input
            type="date"
            id="ultima_visita"
            name="ultima_visita"
            value={ultimaVisita}
            onChange={cambiar(setUltimaVisita, 'ultima_visita')}
            max={hoyISO()}
            required
          />
          {mensajeError('ultima_visita')}
        </div>

        <div {...propsCampo('imagen', 'campo--ancho')}>
          <label htmlFor="imagen">Fotografía del Paciente (opcional)</label>
          <input
            ref={inputArchivoRef}
            type="file"
            id="imagen"
            name="imagen"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={manejarImagen}
          />
          {imagen && (
            <div className="vista-previa">
              <img src={imagen} alt={`Vista previa de ${nombreImagen}`} />
              <div>
                <p>{nombreImagen}</p>
                <button type="button" onClick={quitarImagen}>
                  Quitar imagen
                </button>
              </div>
            </div>
          )}
          {mensajeError('imagen')}
        </div>

        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Registrar Paciente'}
        </button>
        </fieldset>
        {errorGuardado && <p className="mensaje-error" role="alert">{errorGuardado}</p>}
      </form>
    </section>
  );
}

export default FormularioPaciente;
