import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  emailForm!: FormGroup;
  securityForm!: FormGroup;
  resetForm!: FormGroup;
  isLoading = false;
  currentStep = 0;
  userSecurityQuestion = '';

  securityQuestions = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿En qué ciudad naciste?',
    '¿Cuál es el nombre de tu mejor amigo de la infancia?',
    '¿Cuál es tu comida favorita?'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    this.emailForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]]
    });

    this.securityForm = this.fb.group({
      respuestaSeguridad: ['', [Validators.required]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmitEmail(): void {
    if (this.emailForm.valid) {
      this.isLoading = true;
      const { emailOrUsername } = this.emailForm.value;

      this.authService.forgotPassword(emailOrUsername).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.userSecurityQuestion = response.preguntaSeguridad;
          this.currentStep = 1;
          this.snackBar.open('Pregunta de seguridad cargada', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Usuario no encontrado';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onSubmitSecurity(): void {
    if (this.securityForm.valid) {
      this.isLoading = true;
      const data = {
        emailOrUsername: this.emailForm.value.emailOrUsername,
        respuesta: this.securityForm.value.respuestaSeguridad // Cambiado a 'respuesta'
      };

      this.authService.verifySecurityAnswer(data).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.currentStep = 2;
          this.snackBar.open('Respuesta correcta', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Respuesta incorrecta';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onSubmitReset(): void {
    if (this.resetForm.valid) {
      const { newPassword, confirmPassword } = this.resetForm.value;

      if (newPassword !== confirmPassword) {
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.isLoading = true;
      const data = {
        emailOrUsername: this.emailForm.value.emailOrUsername,
        newPassword: newPassword,
        confirmPassword: confirmPassword // Agregado confirmPassword
      };

      this.authService.resetPassword(data).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Error al actualizar la contraseña';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
