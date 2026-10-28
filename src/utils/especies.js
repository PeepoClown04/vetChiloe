const CLASES_ESPECIE = {
  Felino: 'badge--felino',
  Canino: 'badge--canino',
  Ave: 'badge--ave',
  Roedor: 'badge--roedor',
  Reptil: 'badge--reptil',
};

export const claseBadge = (especie) => `badge ${CLASES_ESPECIE[especie] ?? 'badge--otro'}`;
