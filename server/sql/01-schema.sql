CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    numero_atencion VARCHAR(20) UNIQUE NOT NULL,
    especie VARCHAR(50) NOT NULL,
    edad INTEGER,
    peso NUMERIC(6, 2),
    dueno VARCHAR(12),
    telefono VARCHAR(13),
    diagnostico TEXT,
    ultima_visita DATE,
    imagen TEXT
);
