const express = require("express")
const app = express()

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const menuItems = [
    {
        id: 1,
        name: "Cappuccino",
        image: "/img/products/cappuccino.png",
        description: "Espresso with steamed milk and a thick layer of foam, finished with a light dusting of chocolate.",
        price: 4.8,
        strength: "Medium to strong"
    },
    {
        id: 2,
        name: "Latte",
        image: "/img/products/latte.png",
        description: "A smooth shot of espresso with plenty of steamed milk and a thin layer of microfoam.",
        price: 4.8,
        strength: "Mild"
    },
    {
        id: 3,
        name: "Flat White",
        image: "/img/products/flat-white.png",
        description: "A double shot of espresso topped with velvety steamed milk, no foam, creamy and balanced.",
        price: 4.5,
        strength: "Medium"
    },
    {
        id: 4,
        name: "Long Black",
        image: "/img/products/long-black.png",
        description: "Hot water topped with a double shot of espresso, delivering a rich, full coffee hit.",
        price: 4.2,
        strength: "Strong"
    },
    {
        id: 5,
        name: "Mocha",
        image: "/img/products/mocha.png",
        description: "Espresso blended with chocolate and steamed milk, a sweet choice for chocolate and caffeine lovers.",
        price: 5.2,
        strength: "Medium"
    },
    {
        id: 6,
        name: "Iced Latte",
        image: "/img/products/iced-latte.png",
        description: "Fresh espresso poured over ice with cold milk, light and refreshing for warm days or late study sessions.",
        price: 5.5,
        strength: "Light"
    }
];

/*********** API Endpoints ***********/

// GET /api/menu - retrieve coffee menu items
app.get("/api/menu", (req, res) => {
    res.json({ items: menuItems });
});

// POST /api/orders - place a new coffee order
app.post("/api/orders", (req, res) => {
    const order = req.body || {};

    console.log("New coffee order received:", order);

    res.status(201).json({
        message: "Order received. We'll get brewing shortly!"
    });
});

// Root endpoint
app.get("/api/", (req, res) => {
    res.json({
        message: "Coffee Shop API",
        endpoints: [
            "GET /api/menu",
            "POST /api/orders  (JSON: { customerName: <string>, items: [<coffeeId>, ...] })"
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);               // log for debugging
    if (res.headersSent) return next(err); // if headers already sent, delegate to Express
    res.status(500).json({ error: 'Internal server error.' });
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'This endpoint does not exists.' });
});

// Start server
const port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("App listening to: "+port)
})