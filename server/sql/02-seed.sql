INSERT INTO pacientes (
    nombre, numero_atencion, especie, edad, peso, dueno,
    telefono, diagnostico, ultima_visita, imagen
)
VALUES (
    'Mercedes', '2026-B2', 'Felino', 8, 3.20, '11111111-1',
    '+56912345678', 'Tratamiento por otitis leve.', CURRENT_DATE,
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'
)
ON CONFLICT (numero_atencion) DO NOTHING;
