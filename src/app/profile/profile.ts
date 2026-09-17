import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  name = '';
  email = '';
  phone = '';
  address = '';
  favoriteTypes = '';
  password = '';

  message = '';

  constructor(
    public authService: AuthService
  ) {
    this.loadUser();
  }

    // Ucitavanje podataka prijavljenog korisnika
  loadUser(): void {
    const user =
      this.authService.currentUser();

    if (!user) {
      return;
    }

    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.favoriteTypes = user.favoriteTypes;
    this.password = user.password;
  }

  // Cuvanje izmena korisnickog profila
  save(): void {
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password
    ) {
      this.message =
        'Ime, email i lozinka su obavezni.';

      return;
    }

    const success =
      this.authService.updateProfile(
        this.name,
        this.email,
        this.phone,
        this.address,
        this.favoriteTypes,
        this.password
      );

    if (!success) {
      this.message =
        'Korisnik sa ovim emailom već postoji.';

      return;
    }

    this.message =
      'Podaci su uspešno sačuvani.';
  }
}
