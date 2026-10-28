import { Search } from 'lucide-react';
import './BuscadorPaciente.css';

function BuscadorPaciente({ texto = '', onCambiar }) {
  return (
    <div className="buscador-paciente">
      <label className="buscador-paciente__etiqueta" htmlFor="buscador-pacientes">
        Buscar pacientes
      </label>

      <div className="buscador-paciente__caja">
        <Search className="buscador-paciente__icono" aria-hidden="true" size={18} />

        <input
          id="buscador-pacientes"
          className="buscador-paciente__campo"
          type="search"
          value={texto}
          placeholder="Buscar por nombre o especie…"
          autoComplete="off"
          onChange={(evento) => onCambiar?.(evento.target.value)}
        />
      </div>
    </div>
  );
}

export default BuscadorPaciente;
