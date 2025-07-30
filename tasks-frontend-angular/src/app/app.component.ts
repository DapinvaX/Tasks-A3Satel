import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tasks-frontend-angular';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar el token al iniciar la aplicación
    if (this.authService.getToken()) {
      this.authService.verifyToken().subscribe({
        next: (isValid) => {
          if (!isValid) {
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      // Si no hay token, redirigir al login
      this.router.navigate(['/login']);
    }
  }
}
