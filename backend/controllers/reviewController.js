const Review = require('../models/Review');
const jwt = require('jsonwebtoken');
const secretKey = 'jwtSecret';

exports.getAllReviews = async (req, res) => {
    let userId;
    let productId;
    try
    {
        jwt.verify(req.headers['authorization'].substring(7), secretKey, (error, decodedToken) => {
            if (error)
            {
                res.status(401).json({
                    success: false,
                    message: error.message
                });
            }
            else
            {
                userId = decodedToken.user.id;
                productId = req.headers['productid'];
            }
        });
        const reviews = await Review.find({product: productId});
        res.status(200).json(reviews);
    }
    catch (error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getReviewById = async (req, res) => {
    try
    {
        const id = req.params.id;
        const review = await Review.findById(id);
        res.status(200).json(review);
    }
    catch (error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.addReview = async (req, res) => {
    try
    {
        let review = {};
        const { productId, rating, comment } = req.body;
        if(req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
            jwt.verify(req.headers['authorization'].substring(7), secretKey, (error, decodedToken) => {
                if (error)
                {
                    res.status(401).json({
                        success: false,
                        message: "Error while decoding token"
                    });
                }
                else
                {
                    review = new Review({
                        user: decodedToken.user.id,
                        product: productId,
                        rating: rating,
                        comment: comment
                    });
                }
            });
            await review.save();
            res.status(200).json(review);
        }
    }
    catch (error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.editReview = async (req, res) => {
    try
    {
        let review = {};
        const { id } = req.params;
        const { productId, rating, comment } = req.body;
        if(req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
            jwt.verify(req.headers['authorization'].substring(7), secretKey, async (error, decodedToken) => {
                if (error)
                {
                    res.status(401).json({
                        success: false,
                        message: "Error while decoding token"
                    });
                }
                else
                {
                    review = await Review.findByIdAndUpdate(id,
                    {
                        user: decodedToken.user.id,
                        product: productId,
                        rating: rating,
                        comment: comment
                    }, { new: true });
                }
            });
            res.status(201).json(review);
        }
    }
    catch (error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await Review.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};