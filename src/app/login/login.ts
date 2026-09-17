import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = 'katarina@gmail.com';
  password = '1234';

  error = signal('');

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  // Prijava korisnika i ucitavanje njegove korpe
  login(): void {
    if (!this.email || !this.password) {
      this.error.set('Unesite email i lozinku.');
      return;
    }

    const success = this.authService.login(
      this.email,
      this.password
    );

    if (!success) {
      this.error.set('Pogrešan email ili lozinka.');
      return;
    }

    this.cartService.loadCart();

    this.router.navigate(['/']);
  }
}

