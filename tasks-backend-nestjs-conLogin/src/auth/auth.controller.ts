import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Get,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifySecurityAnswerDto } from './dto/verify-security-answer.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.emailOrUsername);
  }

  @Post('verify-security-answer')
  @HttpCode(HttpStatus.OK)
  async verifySecurityAnswer(@Body() verifySecurityAnswerDto: VerifySecurityAnswerDto) {
    return this.authService.verifySecurityAnswer(
      verifySecurityAnswerDto.emailOrUsername,
      verifySecurityAnswerDto.respuesta
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.emailOrUsername,
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword
    );
  }
}
