import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  private baseUrl = 'http://localhost:5000/api/auth';
  constructor(private http: HttpClient) { }
  getObjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  private baseApiUrl = 'http://localhost:5000/api/product/getProductInfo';
  getProductObjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/${id}`);
  }
}
