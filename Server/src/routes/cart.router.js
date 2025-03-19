const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

let cart = [];
let nextCartId = 1;
const dataDir = path.join(__dirname, "../data");
const cartFilePath = path.join(dataDir, "cart.json");

function ensureDataDirectoryExists() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadCartData() {
    ensureDataDirectoryExists();

    if (fs.existsSync(cartFilePath)) {
        const data = fs.readFileSync(cartFilePath, "utf-8");
        const parsedData = JSON.parse(data);
        cart = parsedData.cart || [];
        nextCartId = parsedData.nextCartId || 1;
    }
}

function saveCartData() {
    ensureDataDirectoryExists();

    const data = JSON.stringify({ cart, nextCartId }, null, 2);
    fs.writeFileSync(cartFilePath, data, "utf-8");
}

loadCartData();

router.get("/", (req, res) => {
    return res.status(200).json(cart);
});

router.get("/:cid", (req, res) => {
    const cid = parseInt(req.params.cid);
    if (isNaN(cid)) return res.status(400).json({ error: "ID de carrinho inválido" });

    const currentCart = cart.find(c => c.id === cid);
    if (!currentCart) return res.status(404).json({ error: "Carrinho não encontrado" });

    return res.status(200).json(currentCart);
});

router.post("/:cid/product/:pid", (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).json({ error: "ID de carrinho ou produto inválido" });
    }

    const currentCart = cart.find(c => c.id === cid);
    if (!currentCart) return res.status(404).json({ error: "Carrinho não encontrado" });

    const existingProduct = currentCart.products.find(p => p.id === pid);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const newProduct = { id: pid, quantity: 1 };
        currentCart.products.push(newProduct);
    }

    saveCartData();

    return res.status(200).json(currentCart);
});

router.post("/", (req, res) => {
    try {
        const newCart = {
            id: nextCartId++,
            products: []
        };

        cart.push(newCart);
        saveCartData();

        return res.status(201).json({ message: "Carrinho criado com sucesso!", cart: newCart });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Erro ao criar o carrinho" });
    }
});

module.exports = router;
