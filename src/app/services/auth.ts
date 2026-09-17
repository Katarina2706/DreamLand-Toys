import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  favoriteTypes: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

// Servis koji omogucava registraciju, prijavu, odjavu i izmenu profila
export class AuthService {

  private users: User[] = [];

  currentUser = signal<User | null>(null);

  constructor() {
    this.loadUsers();
    this.loadActiveUser();
  }

   // Registracija novog korisnika
  register(user: User): boolean {

    const exists = this.users.some(
      item => item.email === user.email
    );

    if (exists) {
      return false;
    }

    this.users.push(user);

    this.saveUsers();

    this.setActiveUser(user);

    return true;
  }

   // Prijava korisnika
  login(email: string, password: string): boolean {

    const user = this.users.find(
      item =>
        item.email === email &&
        item.password === password
    );

    if (!user) {
      return false;
    }

    this.setActiveUser(user);

    return true;
  }

  // Odjava korisnika
  logout(): void {

    this.currentUser.set(null);

    localStorage.removeItem(
      'activeUserEmail'
    );
  }


  isLoggedIn(): boolean {

    return this.currentUser() !== null;
  }


  updateProfile(
    name: string,
    email: string,
    phone: string,
    address: string,
    favoriteTypes: string,
    password: string
  ): boolean {

    const user = this.currentUser();

    if (!user) {
      return false;
    }

    const emailExists = this.users.some(
      item =>
        item.email === email &&
        item.email !== user.email
    );

    if (emailExists) {
      return false;
    }

    const oldEmail = user.email;

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.favoriteTypes = favoriteTypes;
    user.password = password;

    this.saveUsers();

    localStorage.setItem(
      'activeUserEmail',
      user.email
    );


    if (oldEmail !== email) {

      const oldCart = localStorage.getItem(
        `cart_${oldEmail}`
      );

      if (oldCart) {

        localStorage.setItem(
          `cart_${email}`,
          oldCart
        );

        localStorage.removeItem(
          `cart_${oldEmail}`
        );
      }
    }

    this.currentUser.set({ ...user });

    return true;
  }

  // Ucitavanje korisnika iz LocalStorage-a
  private loadUsers(): void {

    const savedUsers =
      localStorage.getItem('users');

    if (savedUsers) {

      this.users = JSON.parse(savedUsers);

      this.users = this.users.map(user => ({
        ...user,
        phone: user.phone || '',
        address: user.address || '',
        favoriteTypes: user.favoriteTypes || ''
      }));

    }


    const defaultUserExists = this.users.some(
      user => user.email === 'katarina@gmail.com'
    );


    if (!defaultUserExists) {

      const defaultUser: User = {
        name: 'Katarina Đorđević',
        email: 'katarina@gmail.com',
        phone: '0601234567',
        address: 'Beograd',
        favoriteTypes: 'Slagalice',
        password: '1234'
      };

      this.users.push(defaultUser);

      this.saveUsers();
    }
  }


  private saveUsers(): void {

    localStorage.setItem(
      'users',
      JSON.stringify(this.users)
    );
  }


  private setActiveUser(user: User): void {

    this.currentUser.set(user);

    localStorage.setItem(
      'activeUserEmail',
      user.email
    );
  }

  // Ucitavanje trenutno prijavljenog korisnika
  private loadActiveUser(): void {

    const email =
      localStorage.getItem('activeUserEmail');

    if (!email) {
      return;
    }

    const user = this.users.find(
      item => item.email === email
    );

    if (!user) {

      localStorage.removeItem(
        'activeUserEmail'
      );

      return;
    }

    this.currentUser.set(user);
  }
}
