import { Usuario } from './usuario.model';

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion?: string;
  fecha_creacion?: Date;
  fecha_fin?: Date;
  completada: boolean;
  usuarioId?: number;
  usuario?: Usuario;
}
