import { Test, TestingModule } from '@nestjs/testing';
import { TareasService } from './tareas.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

describe('TareasService', () => {
  let service: TareasService;
  let prismaService: any;

  const mockTarea = {
    id: 1,
    titulo: 'Test Task',
    descripcion: 'Test Description',
    completada: false,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    usuarioId: 1,
    usuario: {
      id: 1,
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
    },
  };

  const mockUser = {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      tarea: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TareasService>(TareasService);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTareaDto: CreateTareaDto = {
      titulo: 'New Task',
      descripcion: 'New Description',
    };

    it('should create a new task successfully', async () => {
      // Arrange
      const usuarioId = 1;
      const expectedTarea = {
        ...mockTarea,
        titulo: createTareaDto.titulo,
        descripcion: createTareaDto.descripcion,
      };
      prismaService.tarea.create.mockResolvedValue(expectedTarea);

      // Act
      const result = await service.create(createTareaDto, usuarioId);

      // Assert
      expect(prismaService.tarea.create).toHaveBeenCalledWith({
        data: {
          ...createTareaDto,
          fecha_creacion: expect.any(Date),
          usuarioId,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedTarea);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a specific user', async () => {
      // Arrange
      const usuarioId = 1;
      const mockTareas = [mockTarea, { ...mockTarea, id: 2, titulo: 'Second Task' }];
      prismaService.tarea.findMany.mockResolvedValue(mockTareas);

      // Act
      const result = await service.findAll(usuarioId);

      // Assert
      expect(prismaService.tarea.findMany).toHaveBeenCalledWith({
        where: { usuarioId },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
        orderBy: {
          fecha_creacion: 'desc',
        },
      });
      expect(result).toEqual(mockTareas);
    });

    it('should return empty array when user has no tasks', async () => {
      // Arrange
      const usuarioId = 1;
      prismaService.tarea.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAll(usuarioId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a task when it exists and belongs to user', async () => {
      // Arrange
      const taskId = 1;
      const usuarioId = 1;
      prismaService.tarea.findUnique.mockResolvedValue(mockTarea);

      // Act
      const result = await service.findOne(taskId, usuarioId);

      // Assert
      expect(prismaService.tarea.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(mockTarea);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      // Arrange
      const taskId = 999;
      const usuarioId = 1;
      prismaService.tarea.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(taskId, usuarioId)).rejects.toThrow(
        new NotFoundException('Tarea no encontrada'),
      );
    });

    it('should throw ForbiddenException when task belongs to different user', async () => {
      // Arrange
      const taskId = 1;
      const usuarioId = 2; // Different user
      const taskOfDifferentUser = { ...mockTarea, usuarioId: 1 };
      prismaService.tarea.findUnique.mockResolvedValue(taskOfDifferentUser);

      // Act & Assert
      await expect(service.findOne(taskId, usuarioId)).rejects.toThrow(
        new ForbiddenException('No tienes permiso para acceder a esta tarea'),
      );
    });
  });

  describe('update', () => {
    const updateTareaDto: UpdateTareaDto = {
      titulo: 'Updated Task',
      descripcion: 'Updated Description',
      completada: true,
    };

    it('should update a task successfully', async () => {
      // Arrange
      const taskId = 1;
      const usuarioId = 1;
      const updatedTarea = { ...mockTarea, ...updateTareaDto };
      
      prismaService.tarea.findUnique.mockResolvedValue(mockTarea);
      prismaService.tarea.update.mockResolvedValue(updatedTarea);

      // Act
      const result = await service.update(taskId, updateTareaDto, usuarioId);

      // Assert
      expect(prismaService.tarea.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(prismaService.tarea.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: {
          ...updateTareaDto,
          fecha_actualizacion: expect.any(Date),
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedTarea);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      // Arrange
      const taskId = 999;
      const usuarioId = 1;
      prismaService.tarea.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(taskId, updateTareaDto, usuarioId)).rejects.toThrow(
        new NotFoundException('Tarea no encontrada'),
      );
    });

    it('should throw ForbiddenException when task belongs to different user', async () => {
      // Arrange
      const taskId = 1;
      const usuarioId = 2;
      const taskOfDifferentUser = { ...mockTarea, usuarioId: 1 };
      prismaService.tarea.findUnique.mockResolvedValue(taskOfDifferentUser);

      // Act & Assert
      await expect(service.update(taskId, updateTareaDto, usuarioId)).rejects.toThrow(
        new ForbiddenException('No tienes permiso para modificar esta tarea'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      // Arrange
      const taskId = 1;
      const usuarioId = 1;
      
      prismaService.tarea.findUnique.mockResolvedValue(mockTarea);
      prismaService.tarea.delete.mockResolvedValue(mockTarea);

      // Act
      const result = await service.remove(taskId, usuarioId);

      // Assert
      expect(prismaService.tarea.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(prismaService.tarea.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(result).toEqual(mockTarea);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      // Arrange
      const taskId = 999;
      const usuarioId = 1;
      prismaService.tarea.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(taskId, usuarioId)).rejects.toThrow(
        new NotFoundException('Tarea no encontrada'),
      );
    });

    it('should throw ForbiddenException when task belongs to different user', async () => {
      // Arrange
      const taskId = 1;
      const usuarioId = 2;
      const taskOfDifferentUser = { ...mockTarea, usuarioId: 1 };
      prismaService.tarea.findUnique.mockResolvedValue(taskOfDifferentUser);

      // Act & Assert
      await expect(service.remove(taskId, usuarioId)).rejects.toThrow(
        new ForbiddenException('No tienes permiso para eliminar esta tarea'),
      );
    });
  });
});
