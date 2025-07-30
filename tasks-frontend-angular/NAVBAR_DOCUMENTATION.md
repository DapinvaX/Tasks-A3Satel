# Documentación del Navbar

## Descripción
Este navbar es un componente completo y moderno para Angular que incluye navegación, búsqueda, notificaciones, cambio de tema, y menú de usuario.

## Características

### ✨ Funcionalidades principales:

1. **Navegación principal**
   - Links a páginas principales: Inicio, Nueva Tarea, Todas las Tareas
   - Indicador visual de página activa
   - Responsive para móviles

2. **Búsqueda expandible**
   - Barra de búsqueda que se expande al hacer clic
   - Campo de entrada con botón de limpiar
   - Función de búsqueda al presionar Enter

3. **Sistema de notificaciones**
   - Badge con contador de notificaciones
   - Se oculta automáticamente cuando no hay notificaciones

4. **Cambio de tema**
   - Toggle entre tema claro y oscuro
   - Persistencia en localStorage
   - Detección automática de preferencia del sistema
   - Animaciones suaves

5. **Menú de usuario**
   - Dropdown con opciones de perfil, configuración, ayuda y logout
   - Completamente personalizable

### 🎨 Estilos incluidos:

- **Diseño moderno**: Material Design con sombras y efectos
- **Responsive**: Se adapta a dispositivos móviles
- **Animaciones**: Transiciones suaves y efectos hover
- **Tema oscuro**: Soporte completo para modo oscuro
- **Accesibilidad**: Labels aria y navegación por teclado

### 📱 Responsive:

- **Desktop**: Navegación completa visible
- **Tablet**: Textos de navegación ocultos, solo iconos
- **Mobile**: Navegación principal oculta, botón de búsqueda oculto en pantallas muy pequeñas

## Uso

### Importar en tu componente:

```typescript
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  imports: [NavbarComponent],
  // ...
})
```

### Usar en template:

```html
<app-navbar></app-navbar>
<router-outlet></router-outlet>
```

## Personalización

### Rutas de navegación:
Edita el archivo `navbar.component.html` para cambiar las rutas:

```html
<a routerLink="/tu-ruta" routerLinkActive="active" class="nav-link">
  <mat-icon>tu_icono</mat-icon>
  <span>Tu Texto</span>
</a>
```

### Métodos disponibles:

```typescript
// Cambiar tema
toggleDarkTheme(): void

// Búsqueda
toggleSearch(): void
onSearch(): void
clearSearch(): void

// Menú de usuario
openProfile(): void
openSettings(): void
openHelp(): void
logout(): void
```

### Propiedades configurables:

```typescript
isDarkTheme: boolean = false;          // Estado del tema
isSearchExpanded: boolean = false;     // Estado de la búsqueda expandida
searchQuery: string = '';              // Texto de búsqueda
notificationCount: number = 3;         // Número de notificaciones
```

## Dependencias

El navbar requiere los siguientes módulos de Angular Material:

- `MatToolbarModule`
- `MatIconModule`
- `MatButtonModule`
- `MatMenuModule`
- `MatFormFieldModule`
- `MatInputModule`
- `MatBadgeModule`
- `MatDividerModule`

También requiere:
- `RouterModule` para la navegación
- `FormsModule` para el ngModel de búsqueda
- `CommonModule` para directivas básicas

## Configuración de rutas recomendada

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'nueva-tarea', component: NuevaTareaComponent },
  { path: 'tareas', component: ListaTareasComponent },
  // ... más rutas
];
```

## Notas adicionales

- El navbar se posiciona como `sticky` en la parte superior
- Los estilos incluyen soporte para `backdrop-filter` (con fallbacks)
- Las animaciones están optimizadas para rendimiento
- El componente maneja automáticamente la persistencia del tema en localStorage
- Los métodos del menú de usuario están preparados para integrar con servicios de autenticación

## Próximas mejoras sugeridas

1. Integrar con servicio de autenticación real
2. Añadir notificaciones en tiempo real
3. Implementar búsqueda con autocompletado
4. Añadir más opciones de configuración de tema
5. Integrar con servicio de notificaciones push
