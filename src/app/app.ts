import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.cartService.items.set([]);

    this.router.navigate(['/']);
  }
}
