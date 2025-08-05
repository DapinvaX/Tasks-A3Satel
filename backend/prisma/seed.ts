import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash('123456', 10);

  const usuario1 = await prisma.usuario.upsert({
    where: { email: 'admin@taskapp.com' },
    update: {},
    create: {
      email: 'admin@taskapp.com',
      nombreUsuario: 'admin',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'TaskApp',
      preguntaSeguridad: '¿Cuál es el nombre de tu primera mascota?',
      respuestaSeguridad: await bcrypt.hash('fluffy', 10),
    },
  });

  const usuario2 = await prisma.usuario.upsert({
    where: { email: 'usuario@test.com' },
    update: {},
    create: {
      email: 'usuario@test.com',
      nombreUsuario: 'usuario',
      password: hashedPassword,
      nombre: 'Usuario',
      apellido: 'Prueba',
      preguntaSeguridad: '¿En qué ciudad naciste?',
      respuestaSeguridad: await bcrypt.hash('madrid', 10),
    },
  });

  // Crear tareas de ejemplo
  await prisma.tarea.createMany({
    data: [
      {
        titulo: 'Completar proyecto de tareas',
        descripcion: 'Finalizar la implementación del sistema de gestión de tareas',
        fecha_creacion: new Date(),
        fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde hoy
        completada: false,
        usuarioId: usuario1.id,
      },
      {
        titulo: 'Revisar documentación',
        descripcion: 'Revisar y actualizar la documentación del proyecto',
        fecha_creacion: new Date(),
        completada: true,
        usuarioId: usuario1.id,
      },
      {
        titulo: 'Configurar autenticación',
        descripcion: 'Implementar sistema de login y registro de usuarios',
        fecha_creacion: new Date(),
        fecha_fin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días desde hoy
        completada: true,
        usuarioId: usuario1.id,
      },
      {
        titulo: 'Tarea de ejemplo',
        descripcion: 'Esta es una tarea de ejemplo para el usuario de prueba',
        fecha_creacion: new Date(),
        completada: false,
        usuarioId: usuario2.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completado exitosamente!');
  console.log(`👤 Usuario admin: admin@taskapp.com (contraseña: 123456)`);
  console.log(`👤 Usuario prueba: usuario@test.com (contraseña: 123456)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
