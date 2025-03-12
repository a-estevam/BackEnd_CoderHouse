const express = require("express");
const ProductManager = require("./ProductManager");  

const app = express();
const productManager = new ProductManager("data/products.json")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit);

        if (!isNaN(limit) && limit > 0) {
            return res.json(products.slice(0, limit));
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

app.get("/products/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const product = await productManager.getProductById(pid);

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar produto" });
    }
});

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
