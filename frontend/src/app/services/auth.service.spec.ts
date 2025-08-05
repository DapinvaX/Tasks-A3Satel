import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Usuario, LoginRequest, RegisterRequest, AuthResponse } from '../models/usuario.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: Usuario = {
    id: 1,
    email: 'test@example.com',
    nombreUsuario: 'testuser',
    nombre: 'Test',
    apellido: 'User'
  };

  const mockAuthResponse: AuthResponse = {
    access_token: 'jwt_token',
    user: mockUser
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user and store auth data', () => {
      // Arrange
      const registerData: RegisterRequest = {
        email: 'test@example.com',
        nombreUsuario: 'testuser',
        password: 'password123',
        nombre: 'Test',
        apellido: 'User',
        preguntaSeguridad: '¿Cuál es tu color favorito?',
        respuestaSeguridad: 'azul'
      };

      // Act
      service.register(registerData).subscribe(response => {
        // Assert
        expect(response).toEqual(mockAuthResponse);
        expect(localStorage.getItem('access_token')).toBe('jwt_token');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockAuthResponse);
    });

    it('should handle registration errors', () => {
      // Arrange
      const registerData: RegisterRequest = {
        email: 'test@example.com',
        nombreUsuario: 'testuser',
        password: 'password123',
        nombre: 'Test',
        apellido: 'User',
        preguntaSeguridad: '¿Cuál es tu color favorito?',
        respuestaSeguridad: 'azul'
      };
      const errorResponse = { error: 'Email already exists' };

      // Act
      service.register(registerData).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          // Assert
          expect(error.error).toEqual(errorResponse.error);
        }
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/register');
      req.flush(errorResponse, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('login', () => {
    it('should login user and store auth data', () => {
      // Arrange
      const loginData: LoginRequest = {
        emailOrUsername: 'test@example.com',
        password: 'password123'
      };

      // Act
      service.login(loginData).subscribe(response => {
        // Assert
        expect(response).toEqual(mockAuthResponse);
        expect(localStorage.getItem('access_token')).toBe('jwt_token');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockAuthResponse);
    });

    it('should handle login errors', () => {
      // Arrange
      const loginData: LoginRequest = {
        emailOrUsername: 'test@example.com',
        password: 'wrongpassword'
      };
      const errorResponse = { error: 'Invalid credentials' };

      // Act
      service.login(loginData).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          // Assert
          expect(error.error).toEqual(errorResponse.error);
        }
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/login');
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear localStorage and reset current user', () => {
      // Arrange
      localStorage.setItem('access_token', 'jwt_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      service['currentUserSubject'].next(mockUser);

      // Act
      service.logout();

      // Assert
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      // Arrange
      localStorage.setItem('access_token', 'jwt_token');

      // Act
      const token = service.getToken();

      // Assert
      expect(token).toBe('jwt_token');
    });

    it('should return null when no token exists', () => {
      // Act
      const token = service.getToken();

      // Assert
      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      // Arrange
      localStorage.setItem('access_token', 'jwt_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      service['currentUserSubject'].next(mockUser);

      // Act
      const isAuth = service.isAuthenticated();

      // Assert
      expect(isAuth).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      // Act
      const isAuth = service.isAuthenticated();

      // Assert
      expect(isAuth).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      // Arrange
      service['currentUserSubject'].next(mockUser);

      // Act
      const currentUser = service.getCurrentUser();

      // Assert
      expect(currentUser).toEqual(mockUser);
    });

    it('should return null when no user is logged in', () => {
      // Act
      const currentUser = service.getCurrentUser();

      // Assert
      expect(currentUser).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', () => {
      // Arrange
      const email = 'test@example.com';
      const mockResponse = {
        user: {
          email: 'test@example.com',
          nombreUsuario: 'testuser',
          nombre: 'Test'
        },
        preguntaSeguridad: '¿Cuál es tu color favorito?'
      };

      // Act
      service.forgotPassword(email).subscribe(response => {
        // Assert
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/forgot-password');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ emailOrUsername: email });
      req.flush(mockResponse);
    });
  });

  describe('verifySecurityAnswer', () => {
    it('should verify security answer', () => {
      // Arrange
      const verifyData = {
        emailOrUsername: 'test@example.com',
        respuesta: 'azul'
      };
      const mockResponse = {
        message: 'Success',
        canResetPassword: true
      };

      // Act
      service.verifySecurityAnswer(verifyData).subscribe(response => {
        // Assert
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/verify-security-answer');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(verifyData);
      req.flush(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', () => {
      // Arrange
      const resetData = {
        emailOrUsername: 'test@example.com',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123'
      };
      const mockResponse = {
        success: true,
        message: 'Password updated successfully'
      };

      // Act
      service.resetPassword(resetData).subscribe(response => {
        // Assert
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:4000/auth/reset-password');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(resetData);
      req.flush(mockResponse);
    });
  });

  describe('loadUserFromStorage', () => {
    it('should load user from localStorage on service initialization', () => {
      // Arrange
      localStorage.setItem('access_token', 'jwt_token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Act
      const newService = new AuthService(TestBed.inject(HttpClient));

      // Assert
      newService.currentUser$.subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    });

    it('should not load user when localStorage is empty', () => {
      // Act
      const newService = new AuthService(TestBed.inject(HttpClient));

      // Assert
      newService.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });
});
