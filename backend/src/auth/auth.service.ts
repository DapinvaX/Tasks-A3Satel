import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifySecurityAnswerDto } from './dto/verify-security-answer.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, nombreUsuario, password, nombre, apellido, preguntaSeguridad, respuestaSeguridad } = registerDto;

    // Verificar si el usuario ya existe (por email o nombre de usuario)
    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          { nombreUsuario }
        ]
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('El email ya está registrado');
      }
      if (existingUser.nombreUsuario === nombreUsuario) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
    }

    // Hashear la contraseña y la respuesta de seguridad
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(respuestaSeguridad.toLowerCase(), 10);

    // Crear el usuario
    const user = await this.prisma.usuario.create({
      data: {
        email,
        nombreUsuario,
        password: hashedPassword,
        nombre,
        apellido,
        preguntaSeguridad,
        respuestaSeguridad: hashedSecurityAnswer,
      },
      select: {
        id: true,
        email: true,
        nombreUsuario: true,
        nombre: true,
        apellido: true,
      },
    });

    // Generar JWT
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user,
    };
  }

  async validateUser(emailOrUsername: string, password: string): Promise<any> {
    const user = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { nombreUsuario: emailOrUsername }
        ]
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, respuestaSeguridad, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
      },
    };
  }

  async getProfile(userId: number) {
    return this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
      },
    });
  }

  async forgotPassword(emailOrUsername: string) {
    const user = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { nombreUsuario: emailOrUsername }
        ]
      },
      select: {
        id: true,
        email: true,
        nombreUsuario: true,
        nombre: true,
        preguntaSeguridad: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      user: {
        email: user.email,
        nombreUsuario: user.nombreUsuario,
        nombre: user.nombre,
      },
      preguntaSeguridad: user.preguntaSeguridad,
    };
  }

  async verifySecurityAnswer(emailOrUsername: string, respuesta: string) {
    const user = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { nombreUsuario: emailOrUsername }
        ]
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isAnswerValid = await bcrypt.compare(respuesta.toLowerCase(), user.respuestaSeguridad);
    if (!isAnswerValid) {
      throw new UnauthorizedException('Respuesta de seguridad incorrecta');
    }

    return {
      message: 'Respuesta correcta',
      canResetPassword: true,
    };
  }

  async resetPassword(emailOrUsername: string, newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      throw new ConflictException('Las contraseñas no coinciden');
    }

    const user = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { nombreUsuario: emailOrUsername }
        ]
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }
}
