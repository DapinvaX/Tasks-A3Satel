import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { TareasService } from '../services/tareas.service';
import { AuthGuard } from '../guards/auth.guard';

// Mock components for routing tests
@Component({
  template: '<div>Login Page</div>'
})
class MockLoginComponent { }

@Component({
  template: '<div>Home Page</div>'
})
class MockHomeComponent { }

@Component({
  template: '<div>Protected Page</div>'
})
class MockProtectedComponent { }

describe('Integration Tests', () => {
  let authService: AuthService;
  let tareasService: TareasService;
  let httpMock: HttpTestingController;
  let router: Router;
  let location: Location;
  let authGuard: AuthGuard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MockLoginComponent, MockHomeComponent, MockProtectedComponent],
      providers: [
        AuthService,
        TareasService,
        AuthGuard,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            url: '/'
          }
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    tareasService = TestBed.inject(TareasService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authGuard = TestBed.inject(AuthGuard);

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Authentication Flow', () => {
    it('should complete full login flow', () => {
      // Arrange
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'password123'
      };
      const mockResponse = {
        access_token: 'jwt_token',
        user: {
          id: 1,
          email: 'test@example.com',
          nombreUsuario: 'testuser',
          nombre: 'Test',
          apellido: 'User'
        }
      };

      // Act
      authService.login(loginData).subscribe(response => {
        // Assert
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('access_token')).toBe('jwt_token');
        expect(authService.isAuthenticated()).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should complete full logout flow', () => {
      // Arrange - Set up authenticated state
      localStorage.setItem('access_token', 'jwt_token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        nombreUsuario: 'testuser',
        nombre: 'Test',
        apellido: 'User'
      }));

      // Act
      authService.logout();

      // Assert
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('Tasks Management Flow', () => {
    beforeEach(() => {
      // Set up authenticated state
      localStorage.setItem('access_token', 'jwt_token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        nombreUsuario: 'testuser',
        nombre: 'Test',
        apellido: 'User'
      }));
    });

    it('should complete create task flow', () => {
      // Arrange
      const newTask = {
        titulo: 'New Task',
        descripcion: 'New Description',
        completada: false,
        fecha_fin: undefined
      };
      const createdTask = {
        id: 1,
        ...newTask,
        fecha_creacion: new Date(),
        usuarioId: 1,
        usuario: {
          id: 1,
          nombre: 'Test',
          apellido: 'User',
          email: 'test@example.com',
          nombreUsuario: 'testuser'
        }
      };

      // Act
      tareasService.crearTarea(newTask).subscribe(task => {
        // Assert
        expect(task).toEqual(createdTask);
        expect(task.titulo).toBe('New Task');
      });

      const req = httpMock.expectOne('http://localhost:4000/tareas');
      expect(req.request.method).toBe('POST');
      req.flush(createdTask);
    });

    it('should complete get tasks flow', () => {
      // Arrange
      const mockTasks = [
        {
          id: 1,
          titulo: 'Task 1',
          descripcion: 'Description 1',
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
        },
        {
          id: 2,
          titulo: 'Task 2',
          descripcion: 'Description 2',
          completada: true,
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
        }
      ];

      // Act
      tareasService.getTareas().subscribe(tasks => {
        // Assert
        expect(tasks).toEqual(mockTasks);
        expect(tasks.length).toBe(2);
        expect(tasks[0].completada).toBe(false);
        expect(tasks[1].completada).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:4000/tareas');
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });

    it('should complete update task status flow', () => {
      // Arrange
      const taskId = 1;
      const completada = true;
      const updatedTask = {
        id: 1,
        titulo: 'Task 1',
        descripcion: 'Description 1',
        completada: true,
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

      // Act
      tareasService.cambiarEstadoTarea(taskId, completada).subscribe(task => {
        // Assert
        expect(task).toEqual(updatedTask);
        expect(task.completada).toBe(true);
      });

      const req = httpMock.expectOne(`http://localhost:4000/tareas/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ completada });
      req.flush(updatedTask);
    });

    it('should complete delete task flow', () => {
      // Arrange
      const taskId = 1;

      // Act
      tareasService.eliminarTarea(taskId).subscribe(response => {
        // Assert
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`http://localhost:4000/tareas/${taskId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Authentication Guard', () => {
    it('should allow access when user is authenticated', () => {
      // Arrange
      localStorage.setItem('access_token', 'jwt_token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        nombreUsuario: 'testuser',
        nombre: 'Test',
        apellido: 'User'
      }));

      // Act
      const canActivate = authGuard.canActivate();

      // Assert
      expect(canActivate).toBe(true);
    });

    it('should redirect to login when user is not authenticated', () => {
      // Arrange
      localStorage.clear();

      // Act
      const canActivate = authGuard.canActivate();

      // Assert
      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Error Handling', () => {
    it('should handle login errors gracefully', () => {
      // Arrange
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'wrongpassword'
      };

      // Act
      authService.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(401);
          expect(authService.isAuthenticated()).toBe(false);
        }
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/login');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle task creation errors gracefully', () => {
      // Arrange
      const invalidTask = {
        titulo: '', // Invalid empty title
        descripcion: 'Description',
        completada: false,
        fecha_fin: undefined
      };

      // Act
      tareasService.crearTarea(invalidTask).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://localhost:4000/tareas');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });
});
