const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../ProductManager");

const productsFilePath = path.join(__dirname, "../data/products.json");
const productManager = new ProductManager(productsFilePath);

router.get("/", (req, res) => {
  try {
    const products = productManager.getAllProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { message: "Erro ao carregar produtos" });
  }
});

router.post("/", (req, res) => {
  try {
    const { title, price, description } = req.body;
    
    if (!title || !price || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Title, price e description são obrigatórios" 
      });
    }

    const newProduct = productManager.addProduct(req.body);
    req.app.get("socketServer").emit("newProduct", newProduct);
    
    res.status(201).json({ 
      success: true, 
      product: newProduct 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao adicionar produto" 
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "ID do produto não fornecido" 
      });
    }

    const deleted = productManager.deleteProduct(productId);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Produto não encontrado" 
      });
    }

    req.app.get("socketServer").emit("deletedProduct", productId);
    res.status(200).json({ 
      success: true, 
      message: "Produto excluído com sucesso" 
    });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao excluir produto" 
    });
  }
});

module.exports = router;