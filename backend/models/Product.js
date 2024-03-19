const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    productName: {
        type: String,
        required: [
            true, "Please enter Product name"
        ]
    },
    productDescription: {
        type: String,
        required: [
            true, "Please enter product description"
        ]
    },
    productCategory: {
        type: String,
        required: [
            true, "Please enter product category"
        ]
    },
    productPrice: {
        type: Number,
        required: [
            true, "Please enter product price"
        ],
        maxLength: [8, "Price cannnot exceed length of 8"]
    },
    productImageUrl: {
        type: String,
        required: true
    },
    numberOfReviews: {
        type: Number,
        dedfault: 0
    },
    reviews: [
        {
            review: {
                type: mongoose.Schema.ObjectId,
                ref: "Review"
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);