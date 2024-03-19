import { Router, Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { ProductComponent } from './components/product/product.component';
import { ReviewComponent } from './components/review/review.component';

export const routes: Routes = [
    {path: '', component: UserComponent},
    {path: 'getAllProducts', component: ProductComponent},
    {path: 'getProductById/:id', component: ProductComponent},
    {path: 'createProduct', component: ProductComponent},
    {path: 'updateProduct/:id', component: ProductComponent},
    {path: 'deleteProduct/:id', component: ProductComponent},
    {path: 'getAllReviews', component: ReviewComponent},
    {path: 'getReviewById', component: ReviewComponent},
    {path: 'addReview', component: ReviewComponent},
    {path: 'editReview/:id', component: ReviewComponent},
    {path: 'deleteReview/:id', component: ReviewComponent},
    { path: '**', redirectTo: '/' }
];
