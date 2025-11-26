const mongoose = require('mongoose');
const { connectDB } = require('./db');
const { Product } = require('./models');

// Seed data mirrors the in-app menu items.
const products = [
  {
    name: 'Cappuccino',
    image: '/img/products/cappuccino.png',
    description:
      'Espresso with steamed milk and a thick layer of foam, finished with a light dusting of chocolate.',
    price: 4.8,
    strength: 'Medium to strong',
    isAvailable: true,
  },
  {
    name: 'Latte',
    image: '/img/products/latte.png',
    description:
      'A smooth shot of espresso with plenty of steamed milk and a thin layer of microfoam.',
    price: 4.8,
    strength: 'Mild',
    isAvailable: true,
  },
  {
    name: 'Flat White',
    image: '/img/products/flat-white.png',
    description:
      'A double shot of espresso topped with velvety steamed milk, no foam, creamy and balanced.',
    price: 4.5,
    strength: 'Medium',
    isAvailable: true,
  },
  {
    name: 'Long Black',
    image: '/img/products/long-black.png',
    description:
      'Hot water topped with a double shot of espresso, delivering a rich, full coffee hit.',
    price: 4.2,
    strength: 'Strong',
    isAvailable: true,
  },
  {
    name: 'Mocha',
    image: '/img/products/mocha.png',
    description:
      'Espresso blended with chocolate and steamed milk, a sweet choice for chocolate and caffeine lovers.',
    price: 5.2,
    strength: 'Medium',
    isAvailable: true,
  },
  {
    name: 'Iced Latte',
    image: '/img/products/iced-latte.png',
    description:
      'Fresh espresso poured over ice with cold milk, light and refreshing for warm days or late study sessions.',
    price: 5.5,
    strength: 'Light',
    isAvailable: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Inserted ${products.length} products`);
  } catch (err) {
    console.error('Failed to seed products:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedProducts();

