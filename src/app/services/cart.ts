import { Injectable, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { AuthService } from './auth';


export type ReservationStatus =
  'rezervisano' |
  'pristiglo' |
  'otkazano';


export interface CartItem {
  toy: ToyModel;
  status: ReservationStatus;
  rating?: number;
}


@Injectable({
  providedIn: 'root'
})

// Servis za podatke i logiku korpe
export class CartService {

  items = signal<CartItem[]>([]);


  constructor(
    private authService: AuthService
  ) {
    this.loadCart();
  }

// Dodavanje igracke u korpu
  addToy(toy: ToyModel): boolean {

    const exists = this.items().some(
      item => item.toy.toyId === toy.toyId
    );

    if (exists) {
      return false;
    }

    const newItem: CartItem = {
      toy,
      status: 'rezervisano'
    };

    this.items.update(
      items => [...items, newItem]
    );

    this.saveCart();

    return true;
  }


  removeToy(toyId: number): void {

    this.items.update(
      items =>
        items.filter(
          item => item.toy.toyId !== toyId
        )
    );

    this.saveCart();
  }

  // Promena statusa rezervacije
  changeStatus(
    toyId: number,
    status: ReservationStatus
  ): void {

    this.items.update(
      items =>
        items.map(item => {

          if (item.toy.toyId !== toyId) {
            return item;
          }

          return {
            ...item,
            status
          };
        })
    );

    this.saveCart();
  }

  // Ocenjivanje igracke
  rateToy(
    toyId: number,
    rating: number
  ): void {

    this.items.update(
      items =>
        items.map(item => {

          if (item.toy.toyId !== toyId) {
            return item;
          }

          if (item.status !== 'pristiglo') {
            return item;
          }

          return {
            ...item,
            rating
          };
        })
    );

    this.saveCart();
  }


  getRating(toyId: number): number {

    const item = this.items().find(
      item => item.toy.toyId === toyId
    );

    return item?.rating ?? 0;
  }

  // Izracunavanje ukupne cene
  getTotal(): number {

    return this.items()
      .filter(
        item => item.status !== 'otkazano'
      )
      .reduce(
        (total, item) =>
          total + item.toy.price,
        0
      );
  }

  // Ucitavanje korpe prijavlejnog korpe
  loadCart(): void {

    const user =
      this.authService.currentUser();

    if (!user) {
      this.items.set([]);
      return;
    }

    const savedCart =
      localStorage.getItem(
        this.getStorageKey(user.email)
      );

    if (!savedCart) {
      this.items.set([]);
      return;
    }

    this.items.set(
      JSON.parse(savedCart)
    );
  }


  private saveCart(): void {

    const user =
      this.authService.currentUser();

    if (!user) {
      return;
    }

    localStorage.setItem(
      this.getStorageKey(user.email),
      JSON.stringify(this.items())
    );
  }


  private getStorageKey(
    email: string
  ): string {

    return `cart_${email}`;
  }
}
