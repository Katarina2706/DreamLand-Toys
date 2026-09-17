import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Toy } from '../services/toy';
import { ReviewService } from '../services/review';
import { ToyModel } from '../../models/toy.model';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Loading,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  toys = signal<ToyModel[]>([]);
  filteredToys = signal<ToyModel[]>([]);
  loading = signal(true);

  selectedName = '';
  selectedDescription = '';
  selectedType = '';
  selectedAge = '';
  selectedTarget = '';
  selectedDate = '';
  selectedPrice = '';
  selectedReview = '';

  constructor(
    private toyService: Toy,
    public reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.loadToys();
  }

  // Ucitavanje igracaka sa API-ja
  loadToys(): void {
    this.loading.set(true);

    this.toyService.getToys().subscribe({
      next: (toys) => {
        this.toys.set(toys);
        this.filteredToys.set(toys);
        this.loading.set(false);
      },

      error: (error) => {
        console.error(
          'Greška pri učitavanju igračaka:',
          error
        );

        this.loading.set(false);
      }
    });
  }

  get types(): string[] {
    return [
      ...new Set(
        this.toys().map(toy => toy.type.name)
      )
    ];
  }

  get ageGroups(): string[] {
    return [
      ...new Set(
        this.toys().map(toy => toy.ageGroup.name)
      )
    ];
  }

  filterName(event: Event): void {
    this.selectedName =
      (event.target as HTMLInputElement)
        .value
        .toLowerCase()
        .trim();

    this.filterToys();
  }

  filterDescription(event: Event): void {
    this.selectedDescription =
      (event.target as HTMLInputElement)
        .value
        .toLowerCase()
        .trim();

    this.filterToys();
  }

  filterDate(event: Event): void {
    this.selectedDate =
      (event.target as HTMLInputElement).value;

    this.filterToys();
  }

  filterPrice(event: Event): void {
    this.selectedPrice =
      (event.target as HTMLInputElement).value;

    this.filterToys();
  }

  filterReview(event: Event): void {
    this.selectedReview =
      (event.target as HTMLInputElement)
        .value
        .toLowerCase()
        .trim();

    this.filterToys();
  }
  // Filtriranje igracaka prema izabranim kriterijumima
  filterToys(): void {

    const filtered = this.toys().filter(toy => {

      const matchesName =
        !this.selectedName ||
        toy.name
          .toLowerCase()
          .includes(this.selectedName);

      const matchesDescription =
        !this.selectedDescription ||
        toy.description
          .toLowerCase()
          .includes(this.selectedDescription);

      const matchesType =
        !this.selectedType ||
        toy.type.name === this.selectedType;

      const matchesAge =
        !this.selectedAge ||
        toy.ageGroup.name === this.selectedAge;

      const matchesTarget =
        !this.selectedTarget ||
        toy.targetGroup === this.selectedTarget;

      const matchesDate =
        !this.selectedDate ||
        toy.productionDate === this.selectedDate;

      const matchesPrice =
        !this.selectedPrice ||
        toy.price <= Number(this.selectedPrice);

      const matchesReview =
        this.reviewService.searchReview(
          toy.toyId,
          this.selectedReview
        );

      return (
        matchesName &&
        matchesDescription &&
        matchesType &&
        matchesAge &&
        matchesTarget &&
        matchesDate &&
        matchesPrice &&
        matchesReview
      );
    });

    this.filteredToys.set(filtered);
  }
}
