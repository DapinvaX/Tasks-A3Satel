import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class TareasService {
  constructor(private prisma: PrismaService) {}

  async create(createTareaDto: CreateTareaDto, usuarioId: number) {
    return this.prisma.tarea.create({
      data: {
        ...createTareaDto,
        fecha_creacion: new Date(),
        usuarioId,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.tarea.findMany({
      where: { usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const tarea = await this.prisma.tarea.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });
    
    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    if (tarea.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para acceder a esta tarea');
    }
    
    return tarea;
  }

  async update(id: number, updateTareaDto: UpdateTareaDto, usuarioId: number) {
    // Verificar que la tarea existe y pertenece al usuario
    await this.findOne(id, usuarioId);

    try {
      return await this.prisma.tarea.update({
        where: { id },
        data: updateTareaDto,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
  }

  async remove(id: number, usuarioId: number) {
    // Verificar que la tarea existe y pertenece al usuario
    await this.findOne(id, usuarioId);

    try {
      return await this.prisma.tarea.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
  }
}
