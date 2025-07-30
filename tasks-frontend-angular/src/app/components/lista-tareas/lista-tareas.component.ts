import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TareasService } from '../../services/tareas.service';
import { Tarea } from '../../models/tarea.model';
import { TareaCardComponent } from '../tarea-card/tarea-card.component';

@Component({
  selector: 'app-lista-tareas',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    TareaCardComponent
  ],
  templateUrl: './lista-tareas.component.html',
  styleUrl: './lista-tareas.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ListaTareasComponent implements OnInit {
  private tareasService = inject(TareasService);

  tareas: Tarea[] = [];
  loading = true;
  error: string | null = null;
  editingTareaId: number | null = null;

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.loading = true;
    this.error = null;

    this.tareasService.getTareas().subscribe({
      next: (tareas) => {
        this.tareas = tareas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.error = 'Error al cargar las tareas. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  onToggleEstado(tarea: Tarea) {
    if (tarea.id) {
      this.tareasService.cambiarEstadoTarea(tarea.id, !tarea.completada).subscribe({
        next: (tareaActualizada) => {
          const index = this.tareas.findIndex(t => t.id === tarea.id);
          if (index !== -1) {
            this.tareas[index] = tareaActualizada;
          }
        },
        error: (error) => {
          console.error('Error al cambiar estado de tarea:', error);
        }
      });
    }
  }

  onEliminarTarea(tarea: Tarea) {
    if (tarea.id && confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.tareasService.eliminarTarea(tarea.id).subscribe({
        next: () => {
          this.tareas = this.tareas.filter(t => t.id !== tarea.id);
        },
        error: (error) => {
          console.error('Error al eliminar tarea:', error);
        }
      });
    }
  }

  onEditarTarea(tarea: Tarea) {
    this.editingTareaId = tarea.id ?? null;
  }

  onGuardarCambios(tareaActualizada: Tarea) {
    if (tareaActualizada.id) {
      this.tareasService.actualizarTarea(tareaActualizada.id, tareaActualizada).subscribe({
        next: () => {
          const index = this.tareas.findIndex(t => t.id === tareaActualizada.id);
          if (index !== -1) {
            this.tareas[index] = tareaActualizada;
          }
          this.editingTareaId = null;
        },
        error: (error) => {
          console.error('Error al actualizar tarea:', error);
        }
      });
    }
  }

  onCancelarEdicion() {
    this.editingTareaId = null;
  }

  isEditing(tareaId: number | undefined): boolean {
    return this.editingTareaId === tareaId;
  }
}
