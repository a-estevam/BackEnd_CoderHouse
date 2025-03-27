const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

let products = [];
let nextId = 1;
const dataDir = path.join(__dirname, "../data"); 
const productsFilePath = path.join(dataDir, "products.json");

function ensureDataDirectoryExists() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadProductData() {
    ensureDataDirectoryExists();

    if (fs.existsSync(productsFilePath)) {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        const parsedData = JSON.parse(data);
        products = parsedData.products || [];
        nextId = parsedData.nextId || 1;
    }
}

function saveProductData() {
    ensureDataDirectoryExists();

    const data = JSON.stringify({ products, nextId }, null, 2);
    fs.writeFileSync(productsFilePath, data, "utf-8");
}

loadProductData();

router.get("/", (req, res) => {
    const limit = parseInt(req.query.limit);
    const result = !isNaN(limit) && limit > 0 ? products.slice(0, limit) : products;
    res.json(result);
});

router.get("/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) return res.status(400).json({ error: "ID inválido" });

    const product = products.find(p => p.id === pid);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    res.json(product);
});

router.post("/", (req, res) => {
    const { title, description, price, thumbnail, stock, category, status, code } = req.body;
    if (!title || !description || !price || !stock || !category || !status || !code) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    if (typeof title !== 'string' || title.trim() === "") {
        return res.status(400).json({ error: "Título inválido" });
    }

    if (typeof description !== 'string' || description.trim() === "") {
        return res.status(400).json({ error: "Descrição inválida" });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Preço inválido" });
    }

    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: "Estoque inválido" });
    }

    if (typeof category !== 'string' || category.trim() === "") {
        return res.status(400).json({ error: "Categoria inválida" });
    }

    if (typeof status !== 'string' || (status !== "disponível" && status !== "indisponível")) {
        return res.status(400).json({ error: "Status inválido. Aceito: 'disponível' ou 'indisponível'" });
    }

    if (typeof code !== 'string' || code.trim() === "") {
        return res.status(400).json({ error: "Código inválido" });
    }

    const newProduct = { id: nextId++, title, description, price, thumbnail, stock, category, status, code };
    products.push(newProduct);
    saveProductData();
    res.status(201).json({ message: "Produto cadastrado com sucesso!", product: newProduct });
});

router.put("/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) return res.status(400).json({ error: "ID inválido" });

    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) return res.status(404).json({ error: "Produto não encontrado" });

    products[productIndex] = { ...products[productIndex], ...req.body };
    saveProductData();
    res.json({ message: "Produto atualizado com sucesso!", product: products[productIndex] });
});

router.delete("/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) return res.status(400).json({ error: "ID inválido" });

    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) return res.status(404).json({ error: "Produto não encontrado" });

    products.splice(productIndex, 1);
    saveProductData();
    res.json({ message: "Produto deletado com sucesso!" });
});

module.exports = router;