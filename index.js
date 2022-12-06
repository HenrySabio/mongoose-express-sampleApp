const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const { Product, Categories } = require('./models/product');

const server = '127.0.0.1:27017';
const database = 'farmStand';

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${server}/${database}`);
        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
}

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    console.log(products);
    res.render('products/index', { products });
});

app.post('/products', async (req, res) => {
    console.log(`Creating the following product: ${req.body}`);
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/new', (req, res) => {
    res.render('products/new', { Categories });
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', { product });
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, Categories });
});

app.put('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, runValidators = true);
    res.redirect(`/products/${product._id}`);
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

const getLargestNumberInSet = (set) => {
    return set.reduce((largest, current) => {
        return Math.max(largest, Array.isArray(current) ? getLargestNumberInSet(current) : current);
    }, 0);
}
