import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  isLoggedIn: boolean = false;
  productList: any[] = [];
  displayedProductList: any[] = [];
  productById: any = {
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice: 0,
    productImageUrl: '',
    numberOfReviews: 0,
    reviews: []
  };
  productCreated: any = {
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice: 0,
    productImageUrl: '',
    numberOfReviews: 0,
    reviews: []
  };
  productUpdated: any = {};
  showUpdateForm: boolean = false;
  showAddForm: boolean = false;
  errorMessage: string = "";
  searchQueryCategory: string = '';
  searchQuery: string = '';
  constructor(private productService: ProductService, private userService: UserService, private router: Router, private sharedService: SharedServiceService) { }
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
      this.getAllProducts();
    }
  }

  ifLoggedIn(): boolean {
    this.userService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    })
    return this.isLoggedIn;
  }

  getUserId(): string | null {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log(tokenPayload);
        return tokenPayload.user.id;
      }
    }
    return null;
  }

  getAllProducts(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.productService.getAllProducts(token).subscribe((productList: any) => {
          console.log(productList);
          this.productList = productList;
          this.displayedProductList = [...this.productList];
        });
      }
    }
  }

  getProductById(id: string): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.showUpdateForm = false;
        this.showAddForm = false;
        this.productService.getProductById(id, token).subscribe((productById) => {
          this.productById = productById;
        });
      }
    }
  }

  createProduct(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.showAddForm = true;
        this.showUpdateForm = false;
        this.productService.createProduct(this.productCreated, token).subscribe((productCreated) => {
          this.productCreated = productCreated;
          this.closeAddForm();
          this.getAllProducts();
          this.router.navigate(["/getAllProducts"]);
        });
      }
    }
  }

  resetForm(): void {
    this.productCreated = {
      productName: '',
      productDescription: '',
      productCategory: '',
      productPrice: 0,
      productImageUrl: '',
      numberOfReviews: 0,
      reviews: []
    };
  }

  closeAddForm(): void {
    this.productCreated = {
      productName: '',
      productDescription: '',
      productCategory: '',
      productPrice: 0,
      productImageUrl: '',
      numberOfReviews: 0,
      reviews: []
    };
    this.showAddForm = false;
  }

  showAddFormFunction(): void {
    this.showAddForm = true;
  }

  closeView(): void {
    this.productById = {
      productName: '',
      productDescription: '',
      productCategory: '',
      productPrice: 0,
      productImageUrl: '',
      numberOfReviews: 0,
      reviews: []
    }
  }

  populateUpdateForm(product: Product) {
    this.productUpdated = { ...product };
    this.showUpdateForm = true;
  }

  updateProduct(id: string): Product {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.productService.updateProduct(this.productUpdated, token).subscribe((productUpdated: any) => {
          const index = this.displayedProductList.findIndex((p) => p._id === id);
          if (index !== -1) {
            this.productList[index] = productUpdated;
            this.displayedProductList[index] = productUpdated;
            this.getAllProducts();
            this.showUpdateForm = false;
            this.router.navigate(["/getAllProducts"]);
          }
          this.cancelUpdate();
        },
          error => {
            this.errorMessage = "Error Updating Activity";
          });
      }
    }
    return this.productUpdated;
  }

  cancelUpdate(): void {
    this.showUpdateForm = false;
    this.productUpdated = {
      productName: '',
      productDescription: '',
      productCategory: '',
      productPrice: 0,
      productImageUrl: '',
      numberOfReviews: 0,
      reviews: []
    };
    this.productById = {
      productName: '',
      productDescription: '',
      productCategory: '',
      productPrice: 0,
      productImageUrl: '',
      numberOfReviews: 0,
      reviews: []
    };
  }

  confirmDelete(productId: string): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this activity?');
    if (confirmDelete) {
      this.deleteProduct(productId);
    }
  }

  deleteProduct(id: string): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.productService.deleteProduct(id, token).subscribe(() => {
          this.productList = this.productList.filter((product: any) => product._id !== id);
          this.displayedProductList = [...this.productList];
        },
          error => {
            this.errorMessage = "Error Deleting activity";
          });
      }
    }
  }

  getReviews(product: any): void {
    this.sharedService.triggerProductIdEvent(product);
    this.router.navigate(["/getAllReviews"]);
  }


  applyFilter(): void {
    if (!this.searchQuery?.trim() && !this.searchQueryCategory?.trim()) {
      this.displayedProductList = [...this.productList];
    }
    else if (this.searchQueryCategory?.trim() && !this.searchQuery?.trim()) {
      const queryCategory = this.searchQueryCategory ? this.searchQueryCategory.toLowerCase().trim() : this.searchQueryCategory;
      this.displayedProductList = this.productList.filter(product =>
        product.productCategory.toString().toLowerCase().includes(queryCategory)
      );
    }
    else if (!this.searchQueryCategory?.trim() && this.searchQuery?.trim()) {
      const query = this.searchQuery ? this.searchQuery.toLowerCase().trim() : this.searchQuery;
      this.displayedProductList = this.productList.filter(product =>
        product.productName.toLowerCase().includes(query)
      );
    }
    else {
      const query = this.searchQuery ? this.searchQuery.toLowerCase().trim() : this.searchQuery;
      const queryCategory = this.searchQueryCategory ? this.searchQueryCategory.toLowerCase().trim() : this.searchQueryCategory;
      this.displayedProductList = this.productList.filter(product =>
        product.productName.toLowerCase().includes(query) &&
        product.productCategory.toString().toLowerCase().includes(queryCategory)
      );
    }
  }

  clearFilter(): void {
    this.searchQuery = '';
    this.applyFilter();
  }

  clearFilterCategory(): void {
    this.searchQueryCategory = "";
    this.applyFilter();
  }
}
