import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  name = '';
  email = '';
  phone = '';
  address = '';
  favoriteTypes = '';
  password = '';

  error = signal('');

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  // Registracija novog korisnika
  register(): void {
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password
    ) {
      this.error.set(
        'Popunite obavezna polja.'
      );

      return;
    }

    const success = this.authService.register({
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      favoriteTypes: this.favoriteTypes,
      password: this.password
    });

    if (!success) {
      this.error.set(
        'Korisnik sa ovim emailom već postoji.'
      );

      return;
    }

    this.cartService.loadCart();

    this.router.navigate(['/']);
  }
}
