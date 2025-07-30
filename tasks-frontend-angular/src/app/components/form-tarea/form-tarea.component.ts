import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-form-tarea',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './form-tarea.component.html',
  styleUrl: './form-tarea.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FormTareaComponent {
  private fb = inject(FormBuilder);
  private tareasService = inject(TareasService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  tareaForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.tareaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      fecha_fin: ['']
    });
  }

  onSubmit() {
    if (this.tareaForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const nuevaTarea = {
        ...this.tareaForm.value,
        completada: false
      };

      this.tareasService.crearTarea(nuevaTarea).subscribe({
        next: (tarea) => {
          this.snackBar.open('Tarea creada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error al crear tarea:', error);
          this.snackBar.open('Error al crear la tarea. Intenta nuevamente.', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  // Getter para acceder a los controles del formulario fácilmente
  get titulo() { return this.tareaForm.get('titulo'); }
  get descripcion() { return this.tareaForm.get('descripcion'); }
  get fecha_fin() { return this.tareaForm.get('fecha_fin'); }
}
