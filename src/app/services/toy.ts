import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToyModel } from '../../models/toy.model';

@Injectable({
  providedIn: 'root'
})


// Servis za komunikaciju sa API-jem
export class Toy {

  private readonly apiUrl = 'https://toy.pequla.com/api';

  constructor(private http: HttpClient) {}

  getToys(): Observable<ToyModel[]> {
    return this.http.get<ToyModel[]>(`${this.apiUrl}/toy`);
  }

  getToyById(id: number): Observable<ToyModel> {
    return this.http.get<ToyModel>(`${this.apiUrl}/toy/${id}`);
  }
}
