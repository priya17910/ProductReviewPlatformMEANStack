import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../services/shared-service.service';
import { ObjectService } from '../../services/object.service';
import { ProductService } from '../../services/product.service';
import { StarComponent } from '../star/star.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [FormsModule, CommonModule, StarComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {
  reviewDataAdded: Review = {
    userId: "",
    productId: "",
    rating: 0,
    comment: ""
  };
  reviewById: Review = {
    userId: "",
    productId: "",
    rating: 0,
    comment: ""
  };
  reviewList: any[] = [];
  showReviewAddForm: boolean = false;
  displayedReviewList: any[] = [];
  isLoggedIn: boolean = false;
  reviewUpdated: any = {
    userId: "",
    productId: "",
    rating: 0,
    comment: ""
  };
  showReviewEditForm: boolean = false;
  errorMessage: string = "";
  productId: any = "";
  product: any = {
    id: '',
    userId: '',
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice: 0,
    productImageUrl: ''
  };
  username: string = "";
  email: string = "";
  stars: number[] = [1, 2, 3, 4, 5];
  constructor(private reviewService: ReviewService, private userService: UserService, private router: Router, private sharedService: SharedServiceService, private objectService: ObjectService) { }
  ngOnInit() {
    this.sharedService.productIdEvent.subscribe((product: any) => {
      this.productId = product._id;
      if (localStorage.getItem('productId')) {
        localStorage.removeItem('productId');
      }
      localStorage.setItem('productId', this.productId);
      this.product = product;
    });
    this.getAllReviews();
  }

  getUserFromId(id: string): void {
    this.objectService.getObjectById(id).subscribe((userData: any) => {
      this.username = userData.username;
      this.email = userData.email;
    });
  }

  getProductFromId(id: string): any {
    this.objectService.getProductObjectById(id).subscribe((productData: any) => {
      this.product = {
        id: productData._id,
        userId: productData.user,
        productName: productData.productName,
        productDescription: productData.productDescription,
        productCategory: productData.productCategory,
        productPrice: productData.productPrice,
        productImageUrl: productData.productImageUrl
      }

      this.getUserFromId(this.product.userId);
    });
    return this.product;
  }

  ifLoggedIn(): boolean {
    this.userService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    })
    return this.isLoggedIn;
  }

  getAllReviews(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const productId = localStorage.getItem('productId');
      if (token && productId) {
        this.getProductFromId(productId);
        this.reviewService.getAllReviews(productId, token).subscribe((reviewList) => {
          this.reviewList = reviewList;
          this.displayedReviewList = [...this.reviewList];
        });
      }
    }
  }

  getReviewById(id: string): void {
    const token = localStorage.getItem('token');
    this.showReviewAddForm = false;
    this.showReviewEditForm = false;
    if (token) {
      this.reviewService.getReviewById(id, this.productId, token).subscribe(
        (review) => {
          this.reviewById = review;
        },
        error => {
          console.error('Error in getting review:', error);
        }
      )
    }
  }


  addReview(productId: string): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.reviewDataAdded.productId = productId;
        this.reviewService.addReview(this.reviewDataAdded, this.productId, token).subscribe((reviewDataAdded) => {
          this.reviewDataAdded = reviewDataAdded;
          this.showReviewAddForm = false;
          this.router.navigate(["/getAllReviews"]);
          this.getAllReviews();
        });
      }
    }
  }

  resetForm(): void {
    this.reviewDataAdded = {
      userId: "",
      productId: "",
      rating: 0,
      comment: ""
    };
  }

  closeAddForm(): void {
    this.reviewDataAdded = {
      userId: "",
      productId: "",
      rating: 0,
      comment: ""
    };
    this.showReviewAddForm = false;
  }

  showAddFormFunction(): void {
    if (typeof localStorage !== 'undefined') {
      this.productId = localStorage.getItem('productId');
      this.getProductFromId(this.productId);
    }
    this.showReviewAddForm = true;
  }

  updateRating(event: any): void {
    console.log(event.target.value);
    this.onRatingChanged(event.target.value);
  }

  getUserId(): string | null {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return tokenPayload.user.id;
      }
    }
    return null;
  }

  onRatingChanged(newRating: number): void {
    if (this.reviewDataAdded) {
      this.reviewDataAdded.rating = newRating;
    }
    if (this.reviewUpdated) {
      this.reviewUpdated.rating = newRating;
    }
  }

  populateForm(review: Review): void {
    this.reviewUpdated = { ...review };
    this.showReviewEditForm = true;
  }

  editReview(reviewId: string): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const productId = localStorage.getItem('productId');
      if (token && productId) {
        this.reviewUpdated.productId = productId;
        this.reviewService.editReview(this.reviewUpdated, productId, token).subscribe((reviewUpdated: any) => {
          const index = this.displayedReviewList.findIndex((r) => reviewId === r._id);
          if (index !== -1) {
            this.router.navigate(["/getAllReviews"]);
            this.reviewList[index] = reviewUpdated;
            this.displayedReviewList[index] = reviewUpdated;
            this.getAllReviews();
            this.showReviewEditForm = false;
          }
          this.cancelEdit();
        },
          error => {
            this.errorMessage = error;
          });
      }
    }
  }

  cancelEdit(): void {
    this.showReviewEditForm = false;
    this.reviewUpdated = {
      userId: "",
      productId: "",
      rating: 0,
      comment: ""
    }
    this.reviewDataAdded = {
      userId: "",
      productId: "",
      rating: 0,
      comment: ""
    }
  }

  confirmDelete(reviewId: string): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (confirmDelete) {
      this.deleteReview(reviewId);
    }
  }

  deleteReview(reviewId: string): void {
    const token = localStorage.getItem('token');
    this.showReviewEditForm = false;
    if (token) {
      this.reviewService.deleteReview(reviewId, this.productId, token).subscribe(
        () => {
          this.reviewList = this.reviewList.filter((review: any) => review._id !== reviewId);
          this.displayedReviewList = [...this.reviewList]
        },
        error => {
          this.errorMessage = error;
        }
      );
    }
  }
}
