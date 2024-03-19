import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:5000/api/product';
  constructor(private httpClient: HttpClient) { }

  getAllProducts(token: string): Observable<Product[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Product[]>(`${this.baseUrl}/getAllProducts`, { headers });
  };

  getProductById(id: string, token: string): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Product>(`${this.baseUrl}/getProductById/${id}`, { headers });
  };

  createProduct(product: Product, token: string): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<Product>(`${this.baseUrl}/createProduct`, product, { headers });
  };

  updateProduct(product: any, token: string): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.put<Product>(`${this.baseUrl}/updateProduct/${product._id}`, product, { headers });
  }

  deleteProduct(id: string, token: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.delete<void>(`${this.baseUrl}/deleteProduct/${id}`, { headers });
  }
}
