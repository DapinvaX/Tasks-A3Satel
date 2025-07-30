import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListaTareasComponent } from '../../components/lista-tareas/lista-tareas.component';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    ListaTareasComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
