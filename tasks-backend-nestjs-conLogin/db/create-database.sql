-- Script de creación de la base de datos para TaskApp

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS tasks_db;

-- Usar la base de datos
USE tasks_db;

-- Crear la tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(75) NOT NULL,
    descripcion VARCHAR(200),
    fecha_creacion DATE NOT NULL DEFAULT (CURRENT_DATE),
    fecha_fin DATE,
    completada BOOLEAN NOT NULL DEFAULT FALSE
);

-- Insertar algunas tareas de ejemplo
INSERT INTO tareas (titulo, descripcion, fecha_fin, completada) VALUES
    ('Completar informe mensual', 'Finalizar el informe de ventas del mes de junio', '2025-07-15', FALSE),
    ('Reunión con el cliente', 'Preparar presentación para la reunión con el cliente principal', '2025-07-10', FALSE),
    ('Actualizar documentación', 'Actualizar la documentación del proyecto con los últimos cambios', '2025-07-20', FALSE);
