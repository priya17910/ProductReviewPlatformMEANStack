const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const reviewRoutes = require('../backend/routes/reviewRoutes');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/product-review-forum', {
    family: 4
})
.then (() => console.log("Mongo DB connected"))
.catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/review', reviewRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));