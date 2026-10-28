import { claseBadge } from '../utils/especies';
import './TablaPacientes.css';

function TablaPacientes({ pacientes = [], onVerFicha }) {
  if (pacientes.length === 0) {
    return (
      <p className="tabla-vacia">
        Todavía no hay pacientes registrados. Usa el botón "Nuevo Paciente"
        para agregar el primero.
      </p>
    );
  }

  return (
    <div
      className="tabla-contenedor"
      role="region"
      aria-label="Tabla de pacientes registrados"
      tabIndex={0}
    >
      <table className="tabla-pacientes">
        <thead>
          <tr>
            <th scope="col">NOMBRE</th>
            <th scope="col">N° ATENCIÓN</th>
            <th scope="col">ESPECIE</th>
            <th scope="col">EDAD</th>
            <th scope="col">DIAGNÓSTICO</th>
            <th scope="col">ACCIÓN</th>
          </tr>
        </thead>

        <tbody>
          {pacientes.map((pacienteIterado) => (
            <tr key={pacienteIterado.id}>
              <th scope="row">{pacienteIterado.nombre}</th>

              <td className="celda-codigo">{pacienteIterado.numero_atencion}</td>

              <td>
                <span className={claseBadge(pacienteIterado.especie)}>
                  {pacienteIterado.especie}
                </span>
              </td>

              <td>{pacienteIterado.edad} años</td>

              <td className="celda-diagnostico">
                {pacienteIterado.diagnostico ?? 'Sin registro'}
              </td>

              <td>
                <button
                  type="button"
                  className="btn-ver-carnet"
                  onClick={() => onVerFicha?.(pacienteIterado)}
                  aria-label={`Ver carnet de ${pacienteIterado.nombre}`}
                >
                  Ver Carnet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPacientes;
