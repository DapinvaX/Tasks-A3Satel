import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifySecurityAnswerDto } from './dto/verify-security-answer.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthResponse = {
    access_token: 'jwt_token',
    user: {
      id: 1,
      email: 'test@example.com',
      nombreUsuario: 'testuser',
      nombre: 'Test',
      apellido: 'User',
    },
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    nombreUsuario: 'testuser',
    nombre: 'Test',
    apellido: 'User',
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      getProfile: jest.fn(),
      forgotPassword: jest.fn(),
      verifySecurityAnswer: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      nombreUsuario: 'testuser',
      password: 'password123',
      nombre: 'Test',
      apellido: 'User',
      preguntaSeguridad: '¿Cuál es tu color favorito?',
      respuestaSeguridad: 'azul',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      authService.register.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle registration errors', async () => {
      // Arrange
      const error = new Error('Email already exists');
      authService.register.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const req = { user: mockUser };
      const loginDto = { emailOrUsername: 'test@example.com', password: 'password123' };
      authService.login.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.login(req, loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      // Arrange
      const req = { user: { id: 1 } };
      authService.getProfile = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await controller.getProfile(req);

      // Assert
      expect(authService.getProfile).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      emailOrUsername: 'test@example.com',
    };

    it('should return security question for valid email', async () => {
      // Arrange
      const mockResponse = {
        user: {
          email: 'test@example.com',
          nombreUsuario: 'testuser',
          nombre: 'Test',
        },
        preguntaSeguridad: '¿Cuál es tu color favorito?',
      };
      authService.forgotPassword.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.forgotPassword(forgotPasswordDto);

      // Assert
      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto.emailOrUsername);
      expect(result).toEqual(mockResponse);
    });

    it('should handle forgot password errors', async () => {
      // Arrange
      const error = new Error('Email not found');
      authService.forgotPassword.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.forgotPassword(forgotPasswordDto)).rejects.toThrow(error);
    });
  });

  describe('verifySecurityAnswer', () => {
    const verifyDto: VerifySecurityAnswerDto = {
      emailOrUsername: 'test@example.com',
      respuesta: 'azul',
    };

    it('should verify security answer successfully', async () => {
      // Arrange
      const mockResponse = { message: 'Success', canResetPassword: true };
      authService.verifySecurityAnswer.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.verifySecurityAnswer(verifyDto);

      // Assert
      expect(authService.verifySecurityAnswer).toHaveBeenCalledWith(verifyDto.emailOrUsername, verifyDto.respuesta);
      expect(result).toEqual(mockResponse);
    });

    it('should handle verification errors', async () => {
      // Arrange
      const error = new Error('Incorrect security answer');
      authService.verifySecurityAnswer.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.verifySecurityAnswer(verifyDto)).rejects.toThrow(error);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      emailOrUsername: 'test@example.com',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    };

    it('should reset password successfully', async () => {
      // Arrange
      const mockResponse = { success: true, message: 'Password updated successfully' };
      authService.resetPassword.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.resetPassword(resetPasswordDto);

      // Assert
      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.emailOrUsername,
        resetPasswordDto.newPassword,
        resetPasswordDto.confirmPassword
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle reset password errors', async () => {
      // Arrange
      const error = new Error('User not found');
      authService.resetPassword.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(error);
    });
  });
});
