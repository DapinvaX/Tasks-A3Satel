import { Test, TestingModule } from '@nestjs/testing';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

describe('TareasController', () => {
  let controller: TareasController;
  let tareasService: any;

  const mockTarea = {
    id: 1,
    titulo: 'Test Task',
    descripcion: 'Test Description',
    completada: false,
    fecha_creacion: new Date(),
    fecha_fin: null,
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
    email: 'test@example.com',
    nombre: 'Test',
    apellido: 'User',
  };

  beforeEach(async () => {
    const mockTareasService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareasController],
      providers: [
        {
          provide: TareasService,
          useValue: mockTareasService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TareasController>(TareasController);
    tareasService = module.get(TareasService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTareaDto: CreateTareaDto = {
      titulo: 'New Task',
      descripcion: 'New Description',
    };

    it('should create a new task successfully', async () => {
      // Arrange
      const req = { user: mockUser };
      const newTarea = { ...mockTarea, ...createTareaDto };
      tareasService.create.mockResolvedValue(newTarea);

      // Act
      const result = await controller.create(createTareaDto, req);

      // Assert
      expect(tareasService.create).toHaveBeenCalledWith(createTareaDto, mockUser.id);
      expect(result).toEqual(newTarea);
    });

    it('should handle creation errors', async () => {
      // Arrange
      const req = { user: mockUser };
      const error = new Error('Creation failed');
      tareasService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createTareaDto, req)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for the authenticated user', async () => {
      // Arrange
      const req = { user: mockUser };
      const mockTareas = [mockTarea, { ...mockTarea, id: 2, titulo: 'Second Task' }];
      tareasService.findAll.mockResolvedValue(mockTareas);

      // Act
      const result = await controller.findAll(req);

      // Assert
      expect(tareasService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockTareas);
    });

    it('should return empty array when user has no tasks', async () => {
      // Arrange
      const req = { user: mockUser };
      tareasService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll(req);

      // Assert
      expect(tareasService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a specific task', async () => {
      // Arrange
      const req = { user: mockUser };
      const taskId = '1';
      tareasService.findOne.mockResolvedValue(mockTarea);

      // Act
      const result = await controller.findOne(+taskId, req);

      // Assert
      expect(tareasService.findOne).toHaveBeenCalledWith(+taskId, mockUser.id);
      expect(result).toEqual(mockTarea);
    });

    it('should handle task not found', async () => {
      // Arrange
      const req = { user: mockUser };
      const taskId = '999';
      const error = new Error('Task not found');
      tareasService.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(+taskId, req)).rejects.toThrow(error);
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
      const req = { user: mockUser };
      const taskId = '1';
      const updatedTarea = { ...mockTarea, ...updateTareaDto };
      tareasService.update.mockResolvedValue(updatedTarea);

      // Act
      const result = await controller.update(+taskId, updateTareaDto, req);

      // Assert
      expect(tareasService.update).toHaveBeenCalledWith(+taskId, updateTareaDto, mockUser.id);
      expect(result).toEqual(updatedTarea);
    });

    it('should handle update errors', async () => {
      // Arrange
      const req = { user: mockUser };
      const taskId = '1';
      const error = new Error('Update failed');
      tareasService.update.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.update(+taskId, updateTareaDto, req)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      // Arrange
      const req = { user: mockUser };
      const taskId = '1';
      tareasService.remove.mockResolvedValue(mockTarea);

      // Act
      const result = await controller.remove(+taskId, req);

      // Assert
      expect(tareasService.remove).toHaveBeenCalledWith(+taskId, mockUser.id);
      expect(result).toEqual(mockTarea);
    });

    it('should handle deletion errors', async () => {
      // Arrange
      const req = { user: mockUser };
      const taskId = '1';
      const error = new Error('Deletion failed');
      tareasService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.remove(+taskId, req)).rejects.toThrow(error);
    });
  });
});
