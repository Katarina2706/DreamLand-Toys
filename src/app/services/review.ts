import { Injectable, signal } from '@angular/core';

export interface Review {
  reviewId: number;
  toyId: number;
  userName: string;
  comment: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  reviews = signal<Review[]>([]);

  constructor() {
    this.loadReviews();
  }

  // Recenzija izabrane igracke
  getReviewsForToy(toyId: number): Review[] {
    return this.reviews().filter(
      review => review.toyId === toyId
    );
  }

  // Izracunavanje prosecke ocene
  getAverageRating(toyId: number): number {
    const reviews = this.getReviewsForToy(toyId);

    if (reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return total / reviews.length;
  }

  // Pretraga teksta u recenzijama
  searchReview(toyId: number, value: string): boolean {
    if (!value) return true;

    return this.getReviewsForToy(toyId).some(
      review =>
        review.comment
          .toLowerCase()
          .includes(value.toLowerCase())
    );
  }

  addOrUpdateReview(
    toyId: number,
    userName: string,
    comment: string,
    rating: number
  ): void {

    const existingReview = this.reviews().find(
      review =>
        review.toyId === toyId &&
        review.userName === userName
    );

    if (existingReview) {

      this.reviews.update(reviews =>
        reviews.map(review => {

          if (review.reviewId !== existingReview.reviewId) {
            return review;
          }

          return {
            ...review,
            comment,
            rating
          };
        })
      );

      this.saveReviews();

      return;
    }

    const newReview: Review = {
      reviewId: Date.now(),
      toyId,
      userName,
      comment,
      rating
    };

    this.reviews.update(
      reviews => [...reviews, newReview]
    );

    this.saveReviews();
  }

  // Ucitavanje recenzija iz LocalStorage-a
  private loadReviews(): void {
    const savedReviews =
      localStorage.getItem('reviews');

    if (savedReviews) {
      this.reviews.set(
        JSON.parse(savedReviews)
      );

      return;
    }

    const defaultReviews: Review[] = [
      {
        reviewId: 1,
        toyId: 1,
        userName: 'Ana',
        comment:
          'Odlična igračka, kvalitetna i zanimljiva.',
        rating: 5
      },
      {
        reviewId: 2,
        toyId: 1,
        userName: 'Marko',
        comment:
          'Detetu se veoma dopala.',
        rating: 4
      },
      {
        reviewId: 3,
        toyId: 2,
        userName: 'Jelena',
        comment:
          'Lepa igračka i jednostavna za korišćenje.',
        rating: 5
      },
      {
        reviewId: 4,
        toyId: 3,
        userName: 'Nikola',
        comment:
          'Dobar kvalitet za ovu cenu.',
        rating: 4
      }
    ];

    this.reviews.set(defaultReviews);

    this.saveReviews();
  }

  private saveReviews(): void {
    localStorage.setItem(
      'reviews',
      JSON.stringify(this.reviews())
    );
  }
}
