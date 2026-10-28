import { useEffect, useMemo, useState } from 'react';
import './App.css';
import BuscadorPaciente from './components/BuscadorPaciente';
import TablaPacientes from './components/TablaPacientes';
import TarjetaPaciente from './components/TarjetaPaciente';
import FormularioPaciente from './components/FormularioPaciente';
import {
  obtenerPacientes,
  obtenerResumen,
  registrarPaciente,
} from './services/pacienteService';
import { claseBadge } from './utils/especies';

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pacienteCarnet, setPacienteCarnet] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [resumen, setResumen] = useState([]);
  const [refrescarResumen, setRefrescarResumen] = useState(0);

  // `activo` descarta la respuesta si el componente se desmonta antes
  // (StrictMode monta dos veces en desarrollo).
  useEffect(() => {
    let activo = true;

    obtenerPacientes()
      .then((datos) => {
        if (!activo) return;
        setPacientes(datos);
        setError(null);
      })
      .catch((fallo) => {
        if (!activo) return;
        setError(fallo.message ?? 'No se pudo cargar el listado.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    let activo = true;

    obtenerResumen()
      .then((datos) => {
        if (activo) setResumen(datos);
      })
      .catch(() => {
        if (activo) setResumen([]);
      });

    return () => {
      activo = false;
    };
  }, [refrescarResumen]);

  const pacientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) return pacientes;

    return pacientes.filter((pacienteIterado) => (
      `${pacienteIterado.nombre ?? ''} ${pacienteIterado.especie ?? ''}`
        .toLowerCase()
        .includes(termino)
    ));
  }, [busqueda, pacientes]);

  const agregarPacientes = async (datosPaciente) => {
    const pacienteRegistrado = await registrarPaciente(datosPaciente);
    setPacientes((previos) => [...previos, pacienteRegistrado]);
    setRefrescarResumen((previo) => previo + 1);
  };

  const cerrarFormulario = () => setMostrarFormulario(false);
  const cerrarCarnet = () => setPacienteCarnet(null);

  const onVerFicha = (paciente) => setPacienteCarnet(paciente);

  const hayModalAbierto = mostrarFormulario || pacienteCarnet !== null;

  useEffect(() => {
    if (!hayModalAbierto) return undefined;

    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') {
        cerrarFormulario();
        cerrarCarnet();
      }
    };

    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', manejarTecla);

    return () => {
      document.removeEventListener('keydown', manejarTecla);
      document.body.style.overflow = overflowPrevio;
    };
  }, [hayModalAbierto]);

  return (
    <div className="contenedor-principal">
      <header className="cabecera">
        <h1>Sistema de Información - Veterinaria Chiloé</h1>
        <p>Plataforma de control y seguimiento de pacientes</p>
      </header>

      <main>
        <h2>Lista de Pacientes Registrados</h2>

        <BuscadorPaciente texto={busqueda} onCambiar={setBusqueda} />

        {cargando && <p className="tabla-vacia">Cargando pacientes…</p>}

        {error && (
          <p className="tabla-vacia" role="alert">
            {error}
          </p>
        )}

        {!cargando && !error && (
          <>
            {resumen.length > 0 && (
              <div className="resumen-especies" aria-label="Pacientes por especie">
                {resumen.map((fila) => (
                  <span key={fila.especie} className={claseBadge(fila.especie)}>
                    {fila.especie}: {fila.total}
                  </span>
                ))}
              </div>
            )}

            <p className="contador-pacientes" aria-live="polite">
              {pacientesFiltrados.length} de {pacientes.length} pacientes
            </p>

            {pacientesFiltrados.length === 0 && pacientes.length > 0 ? (
              <p className="tabla-vacia">No se encontraron pacientes</p>
            ) : (
              <TablaPacientes pacientes={pacientesFiltrados} onVerFicha={onVerFicha} />
            )}
          </>
        )}
      </main>

      <button
        type="button"
        className="boton-flotante"
        onClick={() => setMostrarFormulario(true)}
        aria-haspopup="dialog"
        aria-expanded={mostrarFormulario}
        aria-controls="modal-formulario"
      >
        <span aria-hidden="true">+</span>
        Nuevo Paciente
      </button>

      {mostrarFormulario && (
        <div
          className="modal-fondo"
          onClick={cerrarFormulario}
          role="presentation"
        >
          <div
            className="modal-contenido"
            id="modal-formulario"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            onClick={(evento) => evento.stopPropagation()}
          >
            <button
              type="button"
              className="modal-cerrar"
              onClick={cerrarFormulario}
              aria-label="Cerrar formulario"
            >
              <span aria-hidden="true">×</span>
            </button>

            <FormularioPaciente
              onAgregarPacientes={agregarPacientes}
              onCerrar={cerrarFormulario}
            />
          </div>
        </div>
      )}

      {pacienteCarnet && (
        <div
          className="modal-fondo"
          onClick={cerrarCarnet}
          role="presentation"
        >
          <div
            className="modal-contenido modal-contenido--carnet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-carnet"
            onClick={(evento) => evento.stopPropagation()}
          >
            <button
              type="button"
              className="modal-cerrar"
              onClick={cerrarCarnet}
              aria-label="Cerrar carnet"
            >
              <span aria-hidden="true">×</span>
            </button>

            <h2 id="titulo-carnet">Carnet de {pacienteCarnet.nombre}</h2>

            <div className="carnet-visual" key={pacienteCarnet.id}>
              <TarjetaPaciente paciente={pacienteCarnet} mostrarReverso />
            </div>

            <p className="carnet-ayuda">
              Haz clic sobre el carnet para girarlo y ver la fotografía.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
