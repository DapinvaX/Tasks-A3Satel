import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifySecurityAnswerDto } from './dto/verify-security-answer.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// Mock bcryptjs
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    nombreUsuario: 'testuser',
    password: 'hashedpassword',
    nombre: 'Test',
    apellido: 'User',
    preguntaSeguridad: '¿Cuál es tu color favorito?',
    respuestaSeguridad: 'hashedanswer',
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      usuario: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(), // Ensure this is a jest.fn() so it can be mocked
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(null);
      mockedBcrypt.hash.mockImplementation((text) => Promise.resolve(`hashed_${text}`));
      (prismaService.usuario.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: registerDto.email,
        nombreUsuario: registerDto.nombreUsuario,
        nombre: registerDto.nombre,
        apellido: registerDto.apellido,
      } as any);
      jwtService.sign.mockReturnValue('jwt_token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(prismaService.usuario.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: registerDto.email },
            { nombreUsuario: registerDto.nombreUsuario },
          ],
        },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.respuestaSeguridad.toLowerCase(), 10);
      expect(result).toEqual({
        access_token: 'jwt_token',
        user: expect.objectContaining({
          email: registerDto.email,
          nombreUsuario: registerDto.nombreUsuario,
        }),
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: registerDto.email,
      });

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('El email ya está registrado'),
      );
    });

    it('should throw ConflictException if username already exists', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue({
        ...mockUser,
        nombreUsuario: registerDto.nombreUsuario,
      });

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('El nombre de usuario ya está en uso'),
      );
    });
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(mockUser);
      //mockedBcrypt.compare.mockResolvedValue(true);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(prismaService.usuario.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email },
            { nombreUsuario: email },
          ],
        },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        nombreUsuario: mockUser.nombreUsuario,
        nombre: mockUser.nombre,
        apellido: mockUser.apellido,
        preguntaSeguridad: mockUser.preguntaSeguridad,
        fechaCreacion: mockUser.fechaCreacion,
        fechaActualizacion: mockUser.fechaActualizacion,
      });
    });

    it('should return null when user is not found', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await service.validateUser('nonexistent@example.com', 'password');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(mockUser);
      //mockedBcrypt.compare.mockResolvedValue(false);

      // Act
      const result = await service.validateUser('test@example.com', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      // Arrange
      const user = {
        id: 1,
        email: 'test@example.com',
        nombre: 'Test',
        apellido: 'User',
      };
      jwtService.sign.mockReturnValue('jwt_token');

      // Act
      const result = await service.login(user);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
      expect(result).toEqual({
        access_token: 'jwt_token',
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
        },
      });
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      emailOrUsername: 'test@example.com',
    };

    it('should return user security question when email exists', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await service.forgotPassword(forgotPasswordDto.emailOrUsername);

      // Assert
      expect(prismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { email: forgotPasswordDto.emailOrUsername },
        select: {
          id: true,
          email: true,
          preguntaSeguridad: true,
          nombreUsuario: true,
        },
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        preguntaSeguridad: mockUser.preguntaSeguridad,
      });
      expect(prismaService.usuario.findUnique).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when email does not exist', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.forgotPassword(forgotPasswordDto.emailOrUsername)).rejects.toThrow(
        new UnauthorizedException('Email no encontrado'),
      );
    });
  });

  describe('verifySecurityAnswer', () => {
    const verifyDto: VerifySecurityAnswerDto = {
 emailOrUsername: 'test@example.com',
 respuesta: 'azul',
    };

    it('should return success when security answer is correct', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(mockUser);
      //mockedBcrypt.compare.mockResolvedValue(true);

      // Act
      const result = await service.verifySecurityAnswer(
        verifyDto.emailOrUsername,
        verifyDto.respuesta,
      );

      // Assert
      expect(prismaService.usuario.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: verifyDto.emailOrUsername },
            { nombreUsuario: verifyDto.emailOrUsername },
          ],
        },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        verifyDto.respuesta.toLowerCase(),
        mockUser.respuestaSeguridad,
      );
      expect(result).toEqual({ message: 'Respuesta correcta', canResetPassword: true });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(null);
 
      // Act & Assert
      await expect(
        service.verifySecurityAnswer(verifyDto.emailOrUsername, verifyDto.respuesta),
      ).rejects.toThrow(new UnauthorizedException('Usuario no encontrado'));
    });

    it('should throw UnauthorizedException when security answer is incorrect', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(mockUser); // No changes needed here, the error was in the previous context.
      //mockedBcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.verifySecurityAnswer(verifyDto.emailOrUsername, verifyDto.respuesta),
      ).rejects.toThrow(new UnauthorizedException('Respuesta de seguridad incorrecta'));
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
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(mockUser); // No changes needed here, the error was in the previous context.
      //mockedBcrypt.hash.mockResolvedValue('hashed_newpassword123');
      (prismaService.usuario.update as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        password: 'hashed_newpassword123',
      });

      // Act
      const result = await service.resetPassword(
        resetPasswordDto.emailOrUsername,
        resetPasswordDto.newPassword,
        resetPasswordDto.confirmPassword,
      );

      expect(prismaService.usuario.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: resetPasswordDto.emailOrUsername },
            { nombreUsuario: resetPasswordDto.emailOrUsername },
          ],
        },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(resetPasswordDto.newPassword, 10);
      expect(prismaService.usuario.update).toHaveBeenCalledWith({
        where: { id: mockUser.id }, // Use mockUser.id as the user is found
        data: { password: 'hashed_newpassword123' },
      });
      expect(result).toEqual({ success: true, message: 'Contraseña actualizada correctamente' });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      (prismaService.usuario.findFirst as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.resetPassword(
          resetPasswordDto.emailOrUsername,
          resetPasswordDto.newPassword,
          resetPasswordDto.confirmPassword,
        ),
      ).rejects.toThrow(new UnauthorizedException('Usuario no encontrado'));
    });

    it('should throw ConflictException if passwords do not match', async () => {
      // Act & Assert
      await expect(service.resetPassword('test@example.com', 'password123', 'password456')).rejects.toThrow(
        new ConflictException('Las contraseñas no coinciden'),
      );
    });
  });
});
