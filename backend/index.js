import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import error from './middleware/error.js';

import products from './routes/products.js';
import categories from './routes/categories.js';

import config from './config.js';

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/products", products);
app.use("/api/categories", categories);

app.use(error);

app.get("/test", (req, res) => {
    res.send("API is working");
});

app.listen(config.port, () =>
    console.log(`Server is live @ ${config.hostUrl}`),
);