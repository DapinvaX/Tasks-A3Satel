# 📝 Task Management App con Autenticación - Aplicación Full Stack

## 📋 Descripción del Proyecto

Una aplicación completa de gestión de tareas desarrollada con **Angular** (frontend) y **NestJS** (backend), utilizando **MySQL** como base de datos con **Prisma ORM**. La aplicación incluye un sistema completo de autenticación JWT, gestión de usuarios y funcionalidades avanzadas de gestión de tareas con interfaz moderna y responsive.

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: Angular 19 + Angular Material + TypeScript
- **Backend**: NestJS + TypeScript + Prisma ORM + JWT + bcrypt
- **Base de Datos**: MySQL 8.0 con esquema de usuarios y tareas
- **Autenticación**: JWT (JSON Web Tokens) + Passport.js
- **Seguridad**: Guards, Interceptors, Hash de contraseñas


---

## 🔐 Sistema de Autenticación

### 📊 Características Implementadas

#### ✅ **Registro de Usuarios**
- **Formulario completo**: Nombre, apellido, email, nombre de usuario, contraseña
- **Preguntas de seguridad**
: 4 preguntas predefinidas para recuperación de contraseña
- **Validaciones robustas**: Email único, nombre de usuario único, validaciones de longitud
- **Hash seguro**: Contraseñas y respuestas de seguridad hasheadas con bcrypt
- **JWT automático**: Generación de token JWT al registrarse

#### ✅ **Sistema de Login**
- **Login flexible**: Email o nombre de usuario + contraseña
- **Validación de credenciales**: Verificación con hash bcrypt
- **JWT Token**: Generación de token con expiración de 24h
- **Persistencia**: Almacenamiento seguro en localStorage
- **Estado reactivo**: Observable de usuario actual

#### ✅ **Recuperación de Contraseña**
- **Proceso de 3 pasos**:
  1. **Identificación**: Email o nombre de usuario
  2. **Verificación**: Respuesta a pregunta de seguridad
  3. **Restablecimiento**: Nueva contraseña con confirmación
- **Validaciones**: Verificación de respuestas hasheadas
- **Interfaz stepper**: Wizard guiado con Material Design

#### ✅ **Protección de Rutas**
- **AuthGuard**: Protege rutas que requieren autenticación
- **NoAuthGuard**: Redirige usuarios autenticados desde login/register
- **JWT Interceptor**: Añade automáticamente el token a todas las requests
- **Manejo de expiración**: Logout automático en tokens expirados

---

## 🎯 Backend (NestJS)

### 📊 Características Implementadas

#### ✅ **API REST Completa con Autenticación**
- **Framework**: NestJS 11.0.1 con TypeScript
- **Arquitectura**: Modular con controllers, services, DTOs y guards
- **Validaciones**: Class-validator para validación de datos
- **Transformación**: Class-transformer para mapeo de objetos
- **Passport**: Estrategias Local y JWT para autenticación

#### ✅ **Endpoints de Autenticación**
```http
POST   /auth/register           # Registro de nuevo usuario
POST   /auth/login              # Login con email/username + password
GET    /auth/profile            # Obtener perfil de usuario autenticado
POST   /auth/verify-token       # Verificar validez del token JWT
POST   /auth/forgot-password    # Solicitar recuperación de contraseña
POST   /auth/verify-security-answer  # Verificar respuesta de seguridad
POST   /auth/reset-password     # Restablecer contraseña
```

#### ✅ **Endpoints de Tareas (Protegidos)**
```http
GET    /tareas          # Obtener tareas del usuario autenticado
POST   /tareas          # Crear nueva tarea para el usuario
GET    /tareas/:id      # Obtener tarea específica (solo del usuario)
PATCH  /tareas/:id      # Actualizar tarea (solo del usuario)
DELETE /tareas/:id      # Eliminar tarea (solo del usuario)
```

#### ✅ **Modelos de Datos Completos**

##### **Usuario (DTO)**
```typescript
// RegisterDto
{
  email: string (unique, required)
  nombreUsuario: string (unique, required)
  password: string (min 6 chars, required)
  nombre: string (max 50 chars, required)
  apellido: string (max 50 chars, required)
  preguntaSeguridad: string (required)
  respuestaSeguridad: string (required)
}

// LoginDto
{
  emailOrUsername: string (required)
  password: string (required)
}
```

##### **Tarea (DTO)**
```typescript
// CreateTareaDto
{
  titulo: string (max 75 chars, required)
  descripcion?: string (max 200 chars, optional)
  fecha_fin?: string (ISO date, optional)
  completada?: boolean (default: false)
  // usuarioId se asigna automáticamente del JWT
}
```

#### ✅ **Seguridad y Guards**
- **JWT Strategy**: Validación automática de tokens
- **Local Strategy**: Autenticación con email/username + password
- **JwtAuthGuard**: Protección de rutas que requieren autenticación
- **LocalAuthGuard**: Validación de credenciales en login
- **Password Hashing**: bcrypt con salt rounds 10
- **CORS**: Configurado para desarrollo y producción

#### ✅ **Dependencias de Seguridad**
```json
{
  "@nestjs/passport": "^10.0.0",
  "@nestjs/jwt": "^10.1.0",
  "passport": "^0.6.0",
  "passport-local": "^1.0.0",
  "passport-jwt": "^4.0.1",
  "bcryptjs": "^2.4.3"
}
```

---

## 🎨 Frontend (Angular)

### 📱 Características Implementadas

#### ✅ **Aplicación Single Page (SPA) con Autenticación**
- **Framework**: Angular 19.2.0 con TypeScript
- **Routing**: Lazy loading components con guards de autenticación
- **UI Framework**: Angular Material 19.2.19
- **Forms**: Reactive Forms con validaciones complejas
- **State Management**: BehaviorSubject para estado de usuario

#### ✅ **Páginas y Componentes Implementados**

##### 1. **Login Page Component**
- **Autenticación flexible**: Email o nombre de usuario
- **Validaciones**: Campos requeridos, longitud mínima de contraseña
- **UI Features**: Mostrar/ocultar contraseña, estados de carga
- **Navegación automática**: Redirección post-login
- **Manejo de errores**: Mensajes descriptivos con SnackBar

##### 2. **Register Page Component**
- **Formulario completo**: Todos los campos de usuario
- **Preguntas de seguridad**: Selector dropdown con 4 opciones
- **Validaciones robustas**: Email formato, contraseñas, longitudes
- **UI avanzada**: Campos de contraseña con toggle de visibilidad
- **Integración completa**: Registro automático + login + redirección

##### 3. **Forgot Password Page Component**
- **Wizard de 3 pasos**: Stepper de Material Design
- **Paso 1**: Identificación por email/username
- **Paso 2**: Respuesta a pregunta de seguridad
- **Paso 3**: Nueva contraseña con confirmación
- **Validaciones**: Confirmación de contraseñas, respuestas de seguridad

##### 4. **NavBar Component con Autenticación**
- **Usuario autenticado**: Menú con perfil, logout
- **Usuario anónimo**: Enlaces a login/register
- **Tema dinámico**: Switch claro/oscuro con persistencia
- **Responsive**: Adaptable a dispositivos móviles
- **Estado reactivo**: Actualización automática según autenticación

---

## 🧭 Navbar (documentación)

Componente de navegación moderno con búsqueda, notificaciones, cambio de tema y menú de usuario.

### ✨ Funcionalidades principales
- Navegación: Inicio, Nueva Tarea, etc., con indicador de ruta activa y diseño responsive.
- Búsqueda expandible: barra que se expande al hacer clic con limpiar y Enter para buscar.
- Notificaciones: badge con contador que se oculta si no hay notificaciones.
- Cambio de tema: alterna claro/oscuro, persistido en localStorage y respeta preferencia del sistema.
- Menú de usuario: opciones de perfil, configuración, ayuda y logout.

### Uso
Importa el componente y úsalo en tu plantilla raíz:

```typescript
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  imports: [NavbarComponent],
  // ...
})
export class AppComponent {}
```

```html
<app-navbar></app-navbar>
<router-outlet></router-outlet>
```

### Personalización
- Rutas: editar `navbar.component.html` con tus `routerLink`.
- Métodos disponibles: `toggleDarkTheme()`, `toggleSearch()`, `onSearch()`, `clearSearch()`, `openProfile()`, `openSettings()`, `openHelp()`, `logout()`.
- Propiedades: `isDarkTheme`, `isSearchExpanded`, `searchQuery`, `notificationCount`.

### Dependencias
- Angular Material: `MatToolbarModule`, `MatIconModule`, `MatButtonModule`, `MatMenuModule`, `MatFormFieldModule`, `MatInputModule`, `MatBadgeModule`, `MatDividerModule`.
- Angular: `RouterModule`, `FormsModule`, `CommonModule`.

### Notas y próximas mejoras
- Sticky top con estilos modernos y animaciones suaves.
- Sugerencias: integrar notificaciones en tiempo real, búsqueda con autocompletado y más opciones de tema.

##### 5. **Home Page Component (Protegido)**
- **Dashboard personalizado**: Saludo con nombre de usuario
- **Lista completa de tareas**: Solo del usuario autenticado
- **Estados de carga**: Spinner, error, lista vacía
- **Acciones rápidas**: Botón "Nueva Tarea"
- **Protección**: Solo accesible con autenticación válida

##### 6. **Lista Tareas Component (Mejorado)**
- **Filtrado por usuario**: Solo muestra tareas del usuario autenticado
- **Gestión completa**: CRUD completo con validaciones de permisos
- **Estados visuales**: Loading, error, empty state
- **Integración**: Comunicación con backend protegido

##### 7. **Tarea Card Component (Mejorado)**
- **Modo Visualización**: Solo lectura con información completa
- **Modo Edición**: Formularios reactivos editables inline
- **Checkbox interactivo**: Cambio de estado completado/pendiente
- **Botones de acción**: Editar, Guardar, Cancelar, Eliminar
- **Validaciones**: Tiempo real con mensajes descriptivos
- **Permisos**: Solo el propietario puede editar/eliminar

##### 8. **Nueva Tarea Page (Protegido)**
- **Formulario completo**: Título, descripción, fecha límite
- **Validaciones**: Campos requeridos, longitudes, fechas
- **Asignación automática**: Tarea asignada al usuario autenticado
- **Navegación**: Regreso al home post-creación

#### ✅ **Servicios Implementados**

##### 1. **AuthService Completo**
```typescript
// Métodos de autenticación
register(data: RegisterRequest): Observable<AuthResponse>
login(data: LoginRequest): Observable<AuthResponse>
logout(): void
forgotPassword(emailOrUsername: string): Observable<ForgotPasswordResponse>
verifySecurityAnswer(data: VerifySecurityAnswerRequest): Observable<VerifyResponse>
resetPassword(data: ResetPasswordRequest): Observable<ResetResponse>

// Gestión de estado
isAuthenticated(): boolean
getCurrentUser(): Usuario | null
getToken(): string | null
verifyToken(): Observable<boolean>

// Observable de usuario actual
currentUser$: Observable<Usuario | null>
```

##### 2. **TareasService (Protegido)**
```typescript
// Métodos HTTP con autenticación automática
getTareas(): Observable<Tarea[]>        // Solo del usuario
createTarea(tarea: Tarea): Observable<Tarea>
updateTarea(id: number, tarea: Partial<Tarea>): Observable<Tarea>
deleteTarea(id: number): Observable<void>
```

##### 3. **ThemeService (Mejorado)**
- **Persistencia**: localStorage para tema seleccionado
- **Aplicación automática**: Detecta y aplica tema al cargar
- **Integración completa**: Funciona con todos los componentes

#### ✅ **Guards y Protección**
```typescript
// AuthGuard - Protege rutas autenticadas
canActivate(): boolean // Redirige a /login si no autenticado

// NoAuthGuard - Protege rutas públicas
canActivate(): boolean // Redirige a /home si ya autenticado
```

#### ✅ **Interceptors**
```typescript
// AuthInterceptor - Añade JWT automáticamente
intercept(): Observable<HttpEvent<any>>
// - Añade Bearer token a todas las requests
// - Maneja errores 401 (logout automático)
// - Redirige a login en token expirado
```

#### ✅ **Routing Completo**
```typescript
// Rutas públicas (NoAuthGuard)
'/login' → LoginComponent
'/register' → RegisterComponent
'/forgot-password' → ForgotPasswordComponent

// Rutas protegidas (AuthGuard)
'/home' → HomePageComponent
'/nueva-tarea' → NuevaTareaComponent

// Redirecciones
'/' → redirect to '/home'
'/**' → redirect to '/home'
```

#### ✅ **Modelos TypeScript**
```typescript
// Interfaces completas
Usuario, LoginRequest, RegisterRequest, AuthResponse
ForgotPasswordResponse, VerifySecurityAnswerRequest
ResetPasswordRequest, Tarea

// Constantes
SECURITY_QUESTIONS: string[] // 4 preguntas predefinidas
```

---

## 🗄️ Base de Datos (MySQL)

### 📊 Configuración y Esquema

#### ✅ **Esquema Completo con Usuarios**
```sql
-- Tabla Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    nombreUsuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    preguntaSeguridad VARCHAR(200) NOT NULL,
    respuestaSeguridad VARCHAR(200) NOT NULL
);

-- Tabla Tareas (con relación a usuarios)
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(75) NOT NULL,
    descripcion VARCHAR(200),
    fecha_creacion DATE NOT NULL DEFAULT (CURRENT_DATE),
    fecha_fin DATE,
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    usuarioId INT NOT NULL,
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

#### ✅ **Esquema Prisma Actualizado**
```prisma
model Usuario {
  id                Int      @id @default(autoincrement())
  email             String   @unique @db.VarChar(100)
  nombreUsuario     String   @unique @db.VarChar(50)
  password          String   @db.VarChar(255)
  nombre            String   @db.VarChar(50)
  apellido          String   @db.VarChar(50)
  preguntaSeguridad String   @db.VarChar(200)
  respuestaSeguridad String  @db.VarChar(200)
  tareas            Tarea[]  // Relación uno a muchos
  
  @@map("usuarios")
}

model Tarea {
  id             Int       @id @default(autoincrement())
  titulo         String    @db.VarChar(75)
  descripcion    String?   @db.VarChar(200)
  fecha_creacion DateTime  @db.Date
  fecha_fin      DateTime? @db.Date
  completada     Boolean   @default(false)
  usuarioId      Int       // Clave foránea
  usuario        Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("tareas")
}
```

#### ✅ **Configuración de Conexión**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=tasks_db
DATABASE_URL="mysql://root:1234@localhost:3306/tasks_db"
JWT_SECRET=your-super-secret-jwt-key-here
```

#### ✅ **Migraciones y Datos de Prueba**
- **Migración inicial**: Creación de tabla usuarios y tareas con relaciones
- **Migración auth**: Añadido de campos de autenticación y seguridad
- **Script de seed**: Datos de prueba con usuarios y tareas relacionadas
- **Cascada de eliminación**: Borrar usuario elimina todas sus tareas

#### ✅ **Prisma ORM Features Implementadas**
- **Client Generation**: Auto-generación de tipos TypeScript para Usuario y Tarea
- **Migrations**: Control de versiones de esquema con relaciones
- **Type Safety**: Tipado fuerte en todas las consultas con relaciones
- **Query Builder**: Sintaxis para joins y filtros por usuario
- **Relaciones**: Navegación tipo-segura entre Usuario ↔ Tareas

---

## � Manual de Usuario

### �🚀 Primeros Pasos

#### **1. Registro de Nueva Cuenta**
1. **Acceder a la aplicación**: Navega a `http://localhost:4200`
2. **Ir a Registro**: Click en "Registrarse" desde la página de login
3. **Completar el formulario**:
   - **Datos personales**: Nombre y apellido
   - **Credenciales**: Email único y nombre de usuario único
   - **Contraseña**: Mínimo 6 caracteres
   - **Pregunta de seguridad**: Seleccionar una de 4 opciones disponibles
   - **Respuesta**: Responder la pregunta (se guarda de forma segura)
4. **Enviar**: Click en "Registrarse" - serás logueado automáticamente

#### **2. Iniciar Sesión**
1. **Ir a Login**: Página principal de la aplicación
2. **Introducir credenciales**: 
   - **Usuario**: Email o nombre de usuario (cualquiera de los dos)
   - **Contraseña**: Tu contraseña de registro
3. **Iniciar sesión**: Click en "Iniciar Sesión"
4. **Acceso concedido**: Serás redirigido al dashboard principal

#### **3. Recuperar Contraseña Olvidada**
1. **Desde Login**: Click en "¿Olvidaste tu contraseña?"
2. **Paso 1 - Identificación**: Introduce tu email o nombre de usuario
3. **Paso 2 - Verificación**: Responde tu pregunta de seguridad
4. **Paso 3 - Nueva contraseña**: Establece una nueva contraseña
5. **Completado**: Podrás iniciar sesión con tu nueva contraseña

### 📝 Gestión de Tareas

#### **1. Ver Tus Tareas**
- **Dashboard principal**: Al loguearte verás todas tus tareas
- **Solo tus tareas**: Solo verás las tareas que has creado
- **Estados visuales**: Las tareas completadas aparecen marcadas
- **Información mostrada**: Título, descripción, fecha límite, estado

#### **2. Crear Nueva Tarea**
1. **Botón "Nueva Tarea"**: Desde el dashboard principal
2. **Completar formulario**:
   - **Título**: Obligatorio, máximo 75 caracteres
   - **Descripción**: Opcional, máximo 200 caracteres
   - **Fecha límite**: Opcional, usa el selector de fecha
3. **Guardar**: La tarea se crea y aparece en tu lista

#### **3. Editar Tareas Existentes**
1. **Modo edición**: Click en "Editar" en cualquier tarea
2. **Modificar campos**: Título, descripción, fecha límite
3. **Guardar cambios**: Click en "Guardar" - los cambios se aplican inmediatamente
4. **Cancelar**: Click en "Cancelar" para descartar cambios

#### **4. Marcar como Completada**
- **Checkbox**: Click en la casilla junto a cada tarea
- **Cambio visual**: La tarea cambia de apariencia al completarse
- **Reversible**: Puedes marcar/desmarcar tantas veces como quieras

#### **5. Eliminar Tareas**
1. **Botón eliminar**: Click en el icono de papelera en cada tarea
2. **Confirmación**: Confirma que deseas eliminar la tarea
3. **Eliminación permanente**: La tarea se borra de forma definitiva

### 🎨 Personalización

#### **1. Cambiar Tema (Claro/Oscuro)**
- **Toggle en navbar**: Icono de sol/luna en la barra superior
- **Aplicación inmediata**: El tema cambia al instante
- **Persistencia**: Se recuerda tu preferencia entre sesiones

#### **2. Cerrar Sesión**
- **Menú de usuario**: Click en tu nombre en la navbar
- **Logout**: Selecciona "Cerrar Sesión"
- **Seguridad**: Se elimina tu sesión y debes loguearte de nuevo

---

## 👨‍💻 Manual para Desarrollador

### 🔧 Configuración del Entorno de Desarrollo

#### **1. Prerrequisitos**
```bash
# Software requerido
- Node.js 18+
- MySQL 8.0+
- Git
- VS Code (recomendado)

# Herramientas globales
npm install -g @angular/cli
npm install -g @nestjs/cli
```

#### **2. Configuración de Base de Datos**
```sql
-- 1. Crear base de datos
CREATE DATABASE tasks_db;
USE tasks_db;

-- 2. Crear usuario (opcional)
CREATE USER 'tasks_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tasks_db.* TO 'tasks_user'@'localhost';
FLUSH PRIVILEGES;
```

#### **3. Configuración Backend (NestJS)**
```bash
cd tasks-backend-nestjs

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de DB y JWT_SECRET

# Configurar Prisma
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Opcional: datos de prueba

# Iniciar en desarrollo
npm run start:dev
# Backend disponible en: http://localhost:4000
```

#### **4. Configuración Frontend (Angular)**
```bash
cd tasks-frontend-angular

# Instalar dependencias
npm install

# Configurar variables de entorno (si aplica)
cp .env.example .env

# Iniciar en desarrollo
ng serve
# Frontend disponible en: http://localhost:4200
```

### 🏗️ Arquitectura del Proyecto

#### **Backend (NestJS)**
```
src/
├── auth/
│   ├── dto/                    # DTOs para autenticación
│   ├── guards/                 # JWT y Local guards
│   ├── strategies/             # Passport strategies
│   ├── auth.controller.ts      # Endpoints de auth
│   ├── auth.service.ts         # Lógica de negocio
│   └── auth.module.ts
├── tareas/
│   ├── dto/                    # DTOs para tareas
│   ├── tareas.controller.ts    # CRUD endpoints
│   ├── tareas.service.ts       # Lógica de negocio
│   └── tareas.module.ts
├── prisma/
│   ├── prisma.service.ts       # Cliente Prisma
│   └── prisma.module.ts
├── app.module.ts               # Módulo principal
└── main.ts                     # Bootstrap
```

#### **Frontend (Angular)**
```
src/app/
├── components/                 # Componentes reutilizables
│   ├── navbar/
│   ├── lista-tareas/
│   ├── tarea-card/
│   └── form-tarea/
├── pages/                      # Páginas de la aplicación
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── home-page/
│   └── nueva-tarea/
├── services/                   # Servicios HTTP y lógica
│   ├── auth.service.ts         # Autenticación
│   ├── tareas.service.ts       # Gestión de tareas
│   └── theme.service.ts        # Temas
├── guards/                     # Protección de rutas
│   ├── auth.guard.ts
│   └── no-auth.guard.ts
├── interceptors/               # HTTP interceptors
│   └── auth.interceptor.ts
├── models/                     # Interfaces TypeScript
└── app.routes.ts               # Configuración de rutas
```

### 🔒 Seguridad Implementada

#### **Backend**
- **JWT Tokens**: Expiración 24h, secret configurable
- **Password Hashing**: bcrypt con salt rounds 10
- **Guards**: Protección automática de endpoints
- **Validation**: Class-validator en todos los DTOs
- **CORS**: Configurado para frontends específicos

#### **Frontend**
- **Route Guards**: AuthGuard y NoAuthGuard
- **HTTP Interceptor**: Añade JWT automáticamente
- **Token Management**: Verificación de expiración
- **Secure Storage**: localStorage con validaciones

### � HelpBot (Asistente flotante)

Asistente de ayuda accesible en toda la app mediante un botón flotante en la esquina inferior izquierda.

- Sugerencias iniciales: muestra 3 preguntas frecuentes como botones.
- Follow-ups contextuales: tras cada respuesta del bot, se muestran automáticamente sugerencias relacionadas.
- Comportamiento del input:
  - Si el cuadro de texto tiene contenido, no se muestran sugerencias.
  - Si está vacío y hay una última pregunta, se muestran los follow-ups.
  - Si está vacío y no hay contexto previo, se muestran las sugerencias iniciales.
  - Al borrar todo el texto, reaparecen las sugerencias según el contexto.
- Interacción: al hacer clic en una sugerencia o follow-up, se envía la consulta.
- Animaciones: apertura/cierre suave del panel, “pensando” (tres puntos) y aparición de burbujas de chat.
- Autoscroll: se desplaza automáticamente al último mensaje.
- Nota: la FAQ de cambio de tema existe pero no aparece en las sugerencias iniciales.

### 📦 Despliegue

#### **Producción Backend**
```bash
# Build
npm run build

# Variables de entorno producción
cp .env.example .env.production
# Configurar variables de producción

# Ejecutar
npm run start:prod
```

#### **Producción Frontend**
```bash
# Build para producción
ng build --configuration production

# Servir archivos estáticos
# Los archivos estarán en dist/
```

### 🔧 VS Code Tasks Configuradas

```json
{
  "tasks": [
    {
      "label": "Iniciar Backend Completo",
      "command": "cd tasks-backend-nestjs && npm run start:dev",
      "group": "build",
      "isBackground": true
    },
    {
      "label": "Iniciar Frontend Completo", 
      "command": "cd tasks-frontend-angular && ng serve",
      "group": "build",
      "isBackground": true
    },
    {
      "label": "Setup Completo",
      "dependsOrder": "sequence",
      "dependsOn": [
        "Install Backend Dependencies",
        "Install Frontend Dependencies",
        "Setup Database"
      ]
    }
  ]
}
```

### 🐛 Debugging

#### **Backend Debugging**
- **VS Code**: Configuración de debug incluida
- **Logs**: NestJS logger configurado
- **Database**: Prisma Studio para inspección

#### **Frontend Debugging**
- **Chrome DevTools**: Mapas de source habilitados
- **Angular DevTools**: Extensión para debugging de componentes
- **Redux DevTools**: Para estado de autenticación

---

## 🔒 Seguridad y Variables de Entorno

### ⚠️ **IMPORTANTE: Archivos .env**

**NUNCA subas archivos `.env` al repositorio** - contienen información sensible como:
- Credenciales de base de datos
- Claves JWT secretas (JWT_SECRET)
- URLs de conexión con passwords
- Configuraciones de producción

### ✅ **Configuración Segura Implementada**

#### **Variables de Entorno Backend (.env)**
```bash
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=tasks_db
DATABASE_URL="mysql://root:your-password@localhost:3306/tasks_db"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Server Configuration
PORT=4000
NODE_ENV=development
```

#### **Configuración Inicial Segura**
```bash
# 1. Copia los archivos de ejemplo
cp tasks-backend-nestjs/.env.example tasks-backend-nestjs/.env
cp tasks-frontend-angular/.env.example tasks-frontend-angular/.env

# 2. Genera un JWT_SECRET seguro
# Usar: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
# O ejecutar: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 3. Edita las variables con tus valores reales
# - Cambia las credenciales de base de datos
# - Establece un JWT_SECRET fuerte y único
# - Ajusta las URLs según tu entorno
```

#### **Archivos .gitignore Configurados**
- ✅ `.gitignore` principal en la raíz
- ✅ `.gitignore` específico en backend y frontend  
- ✅ Exclusión de todos los archivos `.env*` (excepto `.env.example`)
- ✅ Exclusión de node_modules, dist, build

### 🛡️ **Mejores Prácticas de Seguridad Implementadas**
- ✅ **JWT Tokens**: Expiración configurable (24h por defecto)
- ✅ **Password Hashing**: bcrypt con salt rounds configurables
- ✅ **Validación de entrada**: Class-validator en todos los endpoints
- ✅ **CORS**: Configurado para dominios específicos
- ✅ **Guards**: Protección automática de rutas sensibles
- ✅ **Interceptors**: Manejo automático de tokens expirados
- ✅ **Variables de entorno**: Configuración sensible externalizada

---

###  **Gestión de Usuarios**
1. **Registro completo**: Usuario se registra con todos los datos requeridos
2. **Login flexible**: Email o username + contraseña
3. **Recuperación segura**: Proceso de 3 pasos con preguntas de seguridad
4. **Sesiones seguras**: JWT con expiración automática
5. **Logout seguro**: Limpieza completa de datos de sesión

### 📝 **Gestión Avanzada de Tareas**
1. **Creación personalizada**: Tareas asignadas automáticamente al usuario
2. **Visualización filtrada**: Solo sus propias tareas
3. **Edición inline**: Modificación sin cambiar de página
4. **Estados dinámicos**: Completar/descompletar con un click
5. **Eliminación segura**: Solo el propietario puede eliminar

### � **Seguridad y Protección**
1. **Rutas protegidas**: Acceso solo con autenticación válida
2. **Autorización granular**: Cada usuario solo ve/modifica sus datos
3. **Tokens seguros**: Renovación automática y manejo de expiración
4. **Validaciones robustas**: Frontend y backend sincronizados

### 🎨 **Experiencia de Usuario**
1. **Responsive design**: Funciona en móvil, tablet y desktop
2. **Temas adaptativos**: Modo claro/oscuro con persistencia
3. **Navegación fluida**: Single Page Application sin recargas
4. **Feedback visual**: Loading states, mensajes de éxito/error
5. **Accesibilidad**: Material Design con buenas prácticas UX

---


##  Estructura Completa del Proyecto

```
tasks-conLogin/
├── 📄 README.md
├── �🔧 .vscode/
│   └── tasks.json
├── 🖥️ tasks-backend-nestjs/
│   ├── 📦 package.json
│   ├── 🔧 tsconfig.json, nest-cli.json, eslint.config.mjs
│   ├── � .env.example (NO subir .env real)
│   ├── 🗄️ db/ (scripts SQL)
│   ├── 🗄️ prisma/ (schema, migrations, seed)
│   └── 📂 src/
│       ├── main.ts, app.module.ts
│       ├── � auth/ (completo: controller, service, DTOs, guards, strategies)
│       ├── 📝 tareas/ (completo: controller, service, DTOs)
│       └── 🗄️ prisma/ (service, module)
└── 🌐 tasks-frontend-angular/
    ├── 📦 package.json
    ├── 🔧 angular.json, tsconfig.json
    ├── � .env.example
    └── 📂 src/
        ├── main.ts, index.html, styles.css
        └── 📂 app/
            ├── app.component.ts, app.routes.ts
            ├── 📂 components/ (navbar, lista-tareas, tarea-card, form-tarea)
            ├── 📂 pages/ (login, register, forgot-password, home-page, nueva-tarea)
            ├── 📂 services/ (auth, tareas, theme)
            ├── 📂 guards/ (auth, no-auth)
            ├── 📂 interceptors/ (auth)
            └── 📂 models/ (interfaces completas)
```

---

*Desarrollado usando Angular + NestJS + MySQL + JWT Authentication*

**Características destacadas**: Autenticación completa, gestión de usuarios, protección de rutas, interfaz responsive y arquitectura escalable.
