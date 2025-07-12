-- add your migration here!!!

CREATE TABLE IF NOT EXISTS dato (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);