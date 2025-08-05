export interface Usuario {
  id: number;
  email: string;
  nombreUsuario: string;
  nombre: string;
  apellido: string;
}

export interface LoginRequest {
  emailOrUsername: string; // Puede ser email o nombre de usuario
  password: string;
}

export interface RegisterRequest {
  email: string;
  nombreUsuario: string;
  password: string;
  nombre: string;
  apellido: string;
  preguntaSeguridad: string;
  respuestaSeguridad: string;
}

export interface AuthResponse {
  access_token: string;
  user: Usuario;
}

export interface ForgotPasswordRequest {
  emailOrUsername: string;
}

export interface ForgotPasswordResponse {
  user: {
    email: string;
    nombreUsuario: string;
    nombre: string;
  };
  preguntaSeguridad: string;
}

export interface VerifySecurityAnswerRequest {
  emailOrUsername: string;
  respuesta: string;
}

export interface ResetPasswordRequest {
  emailOrUsername: string;
  newPassword: string;
  confirmPassword: string;
}

// Preguntas de seguridad predefinidas
export const SECURITY_QUESTIONS = [
  '¿Cuál es el nombre de tu primera mascota?',
  '¿En qué ciudad naciste?',
  '¿Cuál es el nombre de tu mejor amigo de la infancia?',
  '¿Cuál es tu comida favorita?'
];
