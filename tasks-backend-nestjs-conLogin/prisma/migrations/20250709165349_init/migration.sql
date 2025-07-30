-- CreateTable
CREATE TABLE `tareas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(75) NOT NULL,
    `descripcion` VARCHAR(200) NULL,
    `fecha_creacion` DATE NOT NULL,
    `fecha_fin` DATE NULL,
    `completada` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
