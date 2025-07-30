import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/usuario.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockAuthResponse: AuthResponse = {
    access_token: 'jwt_token',
    user: {
      id: 1,
      email: 'test@example.com',
      nombreUsuario: 'testuser',
      nombre: 'Test',
      apellido: 'User'
    }
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.loginForm.get('emailOrUsername')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should have required validators', () => {
      const emailControl = component.loginForm.get('emailOrUsername');
      const passwordControl = component.loginForm.get('password');

      emailControl?.setValue('');
      passwordControl?.setValue('');

      expect(emailControl?.hasError('required')).toBe(true);
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');

      expect(passwordControl?.hasError('minlength')).toBe(true);
    });

    it('should be valid with correct input', () => {
      component.loginForm.patchValue({
        emailOrUsername: 'test@example.com',
        password: 'password123'
      });

      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should call authService.login with form data when form is valid', () => {
      // Arrange
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'password123'
      };
      component.loginForm.patchValue(loginData);
      mockAuthService.login.and.returnValue(of(mockAuthResponse));

      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
    });

    it('should navigate to home page on successful login', () => {
      // Arrange
      component.loginForm.patchValue({
        emailOrUsername: 'test@example.com',
        password: 'password123'
      });
      mockAuthService.login.and.returnValue(of(mockAuthResponse));

      // Act
      component.onSubmit();

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should show success message on successful login', () => {
      // Arrange
      component.loginForm.patchValue({
        emailOrUsername: 'test@example.com',
        password: 'password123'
      });
      mockAuthService.login.and.returnValue(of(mockAuthResponse));

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith('¡Bienvenido!', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });

    it('should show error message on login failure', () => {
      // Arrange
      component.loginForm.patchValue({
        emailOrUsername: 'test@example.com',
        password: 'wrongpassword'
      });
      const errorResponse = { error: { message: 'Invalid credentials' } };
      mockAuthService.login.and.returnValue(throwError(() => errorResponse));

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith('Invalid credentials', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });

    it('should show default error message when no specific error message', () => {
      // Arrange
      component.loginForm.patchValue({
        emailOrUsername: 'test@example.com',
        password: 'wrongpassword'
      });
      mockAuthService.login.and.returnValue(throwError(() => ({})));

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error al iniciar sesión', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });

    it('should not call authService when form is invalid', () => {
      // Arrange
      component.loginForm.patchValue({
        emailOrUsername: '',
        password: ''
      });

      // Act
      component.onSubmit();

      // Assert
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should set loading state during login process', () => {
      // Arrange
      component.loginForm.patchValue({
        emailOrUsername: 'test@example.com',
        password: 'password123'
      });
      mockAuthService.login.and.returnValue(of(mockAuthResponse));

      // Act
      component.onSubmit();

      // Assert
      expect(component.isLoading).toBe(false); // Should be false after successful login
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle hidePassword property', () => {
      // Arrange
      const initialState = component.hidePassword;

      // Act
      component.togglePasswordVisibility();

      // Assert
      expect(component.hidePassword).toBe(!initialState);
    });
  });

  describe('onForgotPassword', () => {
    it('should navigate to forgot-password page', () => {
      // Arrange
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'preventDefault');

      // Act
      component.onForgotPassword(mockEvent);

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/forgot-password']);
    });
  });

  describe('getErrorMessage', () => {
    it('should return required error message for emailOrUsername', () => {
      // Arrange
      const emailControl = component.loginForm.get('emailOrUsername');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      // Act
      const errorMessage = component.getErrorMessage('emailOrUsername');

      // Assert
      expect(errorMessage).toBe('Email o nombre de usuario es requerido');
    });

    it('should return required error message for password', () => {
      // Arrange
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      // Act
      const errorMessage = component.getErrorMessage('password');

      // Assert
      expect(errorMessage).toBe('Contraseña es requerido');
    });

    it('should return minlength error message for password', () => {
      // Arrange
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();

      // Act
      const errorMessage = component.getErrorMessage('password');

      // Assert
      expect(errorMessage).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    it('should return empty string when no errors', () => {
      // Arrange
      const emailControl = component.loginForm.get('emailOrUsername');
      emailControl?.setValue('test@example.com');

      // Act
      const errorMessage = component.getErrorMessage('emailOrUsername');

      // Assert
      expect(errorMessage).toBe('');
    });
  });
});
