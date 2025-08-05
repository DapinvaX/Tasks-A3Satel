-- Datos de prueba para la aplicación de tareas
USE tasks_db;

-- Insertar tareas de ejemplo
INSERT INTO tareas (titulo, descripcion, fecha_creacion, fecha_fin, completada) VALUES
('Implementar autenticación', 'Configurar JWT y sistema de login/registro de usuarios', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), false),
('Diseñar base de datos', 'Crear esquema de base de datos con relaciones entre usuarios y tareas', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), true),
('Configurar frontend Angular', 'Setupar proyecto Angular con Material Design y routing', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), true),
('Implementar CRUD de tareas', 'Crear endpoints para crear, leer, actualizar y eliminar tareas', NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), false),
('Añadir validaciones', 'Implementar validaciones tanto en frontend como backend', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), false),
('Testing unitario', 'Escribir tests unitarios para servicios y componentes', NOW(), DATE_ADD(NOW(), INTERVAL 21 DAY), false),
('Documentar API', 'Crear documentación con Swagger para los endpoints', NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), false),
('Deploy a producción', 'Configurar pipeline de CI/CD y deploy en servidor', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), false),
('Optimizar rendimiento', 'Mejorar tiempo de carga y optimizar consultas', NOW(), DATE_ADD(NOW(), INTERVAL 25 DAY), false),
('Reunión de seguimiento', 'Revisar progreso del proyecto con el equipo', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), true);
