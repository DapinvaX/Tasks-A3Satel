import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TareasService } from './tareas.service';
import { Tarea } from '../models/tarea.model';
import { environment } from '../../environments/environment';

describe('TareasService', () => {
  let service: TareasService;
  let httpMock: HttpTestingController;

  const mockTarea: Tarea = {
    id: 1,
    titulo: 'Test Task',
    descripcion: 'Test Description',
    completada: false,
    fecha_creacion: new Date(),
    fecha_fin: undefined,
    usuarioId: 1,
    usuario: {
      id: 1,
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      nombreUsuario: 'testuser'
    }
  };

  const mockTareas: Tarea[] = [
    mockTarea,
    {
      ...mockTarea,
      id: 2,
      titulo: 'Second Task',
      completada: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TareasService]
    });
    service = TestBed.inject(TareasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTareas', () => {
    it('should retrieve all tasks', () => {
      // Act
      service.getTareas().subscribe(tareas => {
        // Assert
        expect(tareas).toEqual(mockTareas);
        expect(tareas.length).toBe(2);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(environment.apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTareas);
    });

    it('should handle error when retrieving tasks', () => {
      // Act
      service.getTareas().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(environment.apiUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getTarea', () => {
    it('should retrieve a specific task', () => {
      // Arrange
      const taskId = 1;

      // Act
      service.getTarea(taskId).subscribe(tarea => {
        // Assert
        expect(tarea).toEqual(mockTarea);
        expect(tarea.id).toBe(taskId);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTarea);
    });

    it('should handle error when task not found', () => {
      // Arrange
      const taskId = 999;

      // Act
      service.getTarea(taskId).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('crearTarea', () => {
    it('should create a new task', () => {
      // Arrange
      const newTarea: Tarea = {
        titulo: 'New Task',
        descripcion: 'New Description',
        completada: false,
        fecha_fin: undefined
      };

      const createdTarea = { ...mockTarea, ...newTarea };

      // Act
      service.crearTarea(newTarea).subscribe(tarea => {
        // Assert
        expect(tarea).toEqual(createdTarea);
        expect(tarea.titulo).toBe(newTarea.titulo);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(environment.apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTarea);
      req.flush(createdTarea);
    });

    it('should handle validation errors when creating task', () => {
      // Arrange
      const invalidTarea: Tarea = {
        titulo: '', // Invalid empty title
        descripcion: 'Description',
        completada: false,
        fecha_fin: undefined
      };

      // Act
      service.crearTarea(invalidTarea).subscribe({
        next: () => fail('should have failed with validation error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(environment.apiUrl);
      req.flush('Validation Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('actualizarTarea', () => {
    it('should update an existing task', () => {
      // Arrange
      const taskId = 1;
      const updateData: Partial<Tarea> = {
        titulo: 'Updated Task',
        completada: true
      };

      const updatedTarea = { ...mockTarea, ...updateData };

      // Act
      service.actualizarTarea(taskId, updateData as Tarea).subscribe(tarea => {
        // Assert
        expect(tarea).toEqual(updatedTarea);
        expect(tarea.titulo).toBe('Updated Task');
        expect(tarea.completada).toBe(true);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedTarea);
    });

    it('should handle error when updating non-existent task', () => {
      // Arrange
      const taskId = 999;
      const updateData: Partial<Tarea> = {
        titulo: 'Updated Task'
      };

      // Act
      service.actualizarTarea(taskId, updateData as Tarea).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('eliminarTarea', () => {
    it('should delete a task', () => {
      // Arrange
      const taskId = 1;

      // Act
      service.eliminarTarea(taskId).subscribe(response => {
        // Assert
        expect(response).toBeTruthy();
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle error when deleting non-existent task', () => {
      // Arrange
      const taskId = 999;

      // Act
      service.eliminarTarea(taskId).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('cambiarEstadoTarea', () => {
    it('should change task status to completed', () => {
      // Arrange
      const taskId = 1;
      const completada = true;
      const updatedTarea = { ...mockTarea, completada };

      // Act
      service.cambiarEstadoTarea(taskId, completada).subscribe(tarea => {
        // Assert
        expect(tarea).toEqual(updatedTarea);
        expect(tarea.completada).toBe(true);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ completada });
      req.flush(updatedTarea);
    });

    it('should change task status to incomplete', () => {
      // Arrange
      const taskId = 1;
      const completada = false;
      const updatedTarea = { ...mockTarea, completada };

      // Act
      service.cambiarEstadoTarea(taskId, completada).subscribe(tarea => {
        // Assert
        expect(tarea).toEqual(updatedTarea);
        expect(tarea.completada).toBe(false);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ completada });
      req.flush(updatedTarea);
    });

    it('should handle error when changing status of non-existent task', () => {
      // Arrange
      const taskId = 999;
      const completada = true;

      // Act
      service.cambiarEstadoTarea(taskId, completada).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${taskId}`);
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
