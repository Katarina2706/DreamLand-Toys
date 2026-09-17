import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../services/cart';
import type { ReservationStatus } from '../services/cart';
import { ReviewService } from '../services/review';
import { AuthService } from '../services/auth';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cart',
  imports: [ RouterLink, MatIconModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class Cart {

  reviewComments: Record<number, string> = {};

  constructor(
    public cartService: CartService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  changeStatus(
    toyId: number,
    status: ReservationStatus
  ): void {

    this.cartService.changeStatus(
      toyId,
      status
    );
  }


  rate(
    toyId: number,
    rating: number
  ): void {

    this.cartService.rateToy(
      toyId,
      rating
    );
  }

  saveReview(
    toyId: number,
    rating: number | undefined
  ): void {

    const user = this.authService.currentUser();

    if (!user) {
      return;
    }

    if (!rating) {

      Swal.fire({
        title: 'Izaberite ocenu',
        text: 'Pre slanja recenzije izaberite ocenu od 1 do 5.',
        icon: 'warning',
        confirmButtonText: 'U redu'
      });

      return;
    }

    const comment =
      this.reviewComments[toyId]?.trim();

    if (!comment) {

      Swal.fire({
        title: 'Napišite recenziju',
        text: 'Unesite Vaše mišljenje o igrački.',
        icon: 'warning',
        confirmButtonText: 'U redu'
      });

      return;
    }

    this.reviewService.addOrUpdateReview(
      toyId,
      user.name,
      comment,
      rating
    );

    Swal.fire({
      title: 'Hvala!',
      text: 'Vaša recenzija je uspešno sačuvana.',
      icon: 'success',
      confirmButtonText: 'U redu'
    });
  }

  remove(
    toyId: number,
    toyName: string
  ): void {

    Swal.fire({
      title: 'Uklanjanje rezervacije',
      text: `Da li želite da uklonite "${toyName}" iz korpe?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Da, ukloni',
      cancelButtonText: 'Odustani'
    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.cartService.removeToy(toyId);

      Swal.fire({
        title: 'Uklonjeno',
        text: 'Igračka je uklonjena iz korpe.',
        icon: 'success',
        confirmButtonText: 'U redu'
      });
    });
  }
}
