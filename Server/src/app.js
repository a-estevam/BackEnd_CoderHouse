const express = require("express");
const productsRouter = require("./routes/products.router");
const cartRouter = require("./routes/cart.router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});