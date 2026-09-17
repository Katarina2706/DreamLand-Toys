import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Toy } from '../services/toy';
import { CartService } from '../services/cart';
import { AuthService } from '../services/auth';
import { ReviewService } from '../services/review';
import { ToyModel } from '../../models/toy.model';
import { Loading } from '../loading/loading';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  imports: [ RouterLink, Loading, MatIconModule],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details implements OnInit {

  toy = signal<ToyModel | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private toyService: Toy,
    private cartService: CartService,
    private authService: AuthService,
    public reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.loadToy();
  }

  // Ucitavanje igracke
  loadToy(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.toyService.getToyById(id).subscribe({
      next: (toy) => {
        this.toy.set(toy);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(
          'Greška pri učitavanju igračke:',
          error
        );

        this.loading.set(false);
      }
    });
  }

  // Rezervacija izabrane igracke
  reserve(): void {
    const toy = this.toy();

    if (!toy) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        title: 'Prijava je obavezna',
        text: 'Morate biti prijavljeni da biste rezervisali igračku.',
        icon: 'warning',
        confirmButtonText: 'U redu'
      });

      return;
    }

    const added =
      this.cartService.addToy(toy);

    if (!added) {
      Swal.fire({
        title: 'Već rezervisano',
        text: 'Ova igračka se već nalazi u Vašoj korpi.',
        icon: 'info',
        confirmButtonText: 'U redu'
      });

      return;
    }

    Swal.fire({
      title: 'Uspešna rezervacija',
      text: `${toy.name} je dodata u korpu.`,
      icon: 'success',
      confirmButtonText: 'U redu'
    });
  }
}
