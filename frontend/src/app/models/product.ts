import { Review } from "./review";

export interface Product {
    productName: string;
    productDescription: string;
    productCategory: string;
    productPrice: number;
    productImageUrl: string;
    numberOfReviews: number;
    reviews: Review[];
}
