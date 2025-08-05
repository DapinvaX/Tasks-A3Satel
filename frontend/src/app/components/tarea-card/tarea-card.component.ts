import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './tarea-card.component.html',
  styleUrl: './tarea-card.component.css',
  encapsulation: ViewEncapsulation.None
})
export class TareaCardComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) tarea!: Tarea;
  @Input() isEditing = false;

  @Output() readonly toggleEstado = new EventEmitter<Tarea>();
  @Output() readonly eliminar = new EventEmitter<Tarea>();
  @Output() readonly editar = new EventEmitter<Tarea>();
  @Output() readonly guardarCambios = new EventEmitter<Tarea>();
  @Output() readonly cancelarEdicion = new EventEmitter<void>();

  editForm: FormGroup | null = null;

  ngOnInit(): void {
    this.initEditForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tarea'] && !changes['tarea'].isFirstChange()) {
      this.initEditForm();
    }
  }

  private initEditForm(): void {
    if (!this.tarea) return;

    this.editForm = this.fb.group({
      titulo: [
        this.tarea.titulo || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      descripcion: [
        this.tarea.descripcion || '',
        [Validators.maxLength(500)]
      ],
      fecha_fin: [
        this.tarea.fecha_fin ? new Date(this.tarea.fecha_fin) : null
      ],
      completada: [this.tarea.completada || false]
    });
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return '';

    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }

  onToggleEstado(): void {
    this.toggleEstado.emit(this.tarea);
  }

  onEliminar(): void {
    this.eliminar.emit(this.tarea);
  }

  onEditar(): void {
    this.initEditForm();
    this.editar.emit(this.tarea);
  }

  onGuardarCambios(): void {
    if (!this.editForm?.valid) return;

    const tareaActualizada: Tarea = {
      ...this.tarea,
      ...this.editForm.value
    };

    this.guardarCambios.emit(tareaActualizada);
  }

  onCancelarEdicion(): void {
    this.cancelarEdicion.emit();
  }
}
