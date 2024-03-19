const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const secretKey = 'jwtSecret';


exports.getProductDetaisFromId = async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const product = await Product.findById(id);
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllProducts = async (req, res) => {
    let userId;
    try {
        jwt.verify(req.headers['authorization'].substring(7), secretKey, (error, decodedToken) => {
            if (error) {
                res.status(401).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                userId = decodedToken.user.id;
            }
        });
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        let product = {};
        const { productName, productDescription, productCategory, productPrice, productImageUrl } = req.body;
        if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
            jwt.verify(req.headers['authorization'].substring(7), secretKey, (error, decodedToken) => {
                if (error) {
                    res.status(401).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    product = new Product({
                        user: decodedToken.user.id,
                        productName,
                        productDescription,
                        productCategory,
                        productPrice,
                        productImageUrl,
                        numberOfReviews: 0,
                        reviews: []
                    });
                }
            });
            await product.save();
            res.status(200).json({
                success: true,
                product: product
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productDescription, productCategory, productPrice, productImageUrl, numberOfReviews, reviews } = req.body;
        const product = await Product.findByIdAndUpdate(id, {
            productName,
            productDescription,
            productCategory,
            productPrice,
            productImageUrl,
            numberOfReviews,
            reviews
        }, { new: true });
        res.status(201).json({
            success: true,
            product: product
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Delete", id);
        await Product.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while deleting product"
        });
    }
};