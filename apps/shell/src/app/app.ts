import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'quita-shell',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
