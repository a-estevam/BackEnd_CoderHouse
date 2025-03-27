const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../ProductManager");

const productsFilePath = path.join(__dirname, "../data/products.json");
const productManager = new ProductManager(productsFilePath);

router.get("/", async (req, res) => {
  try {
    const products = productManager.getAllProducts();
    if (!products) {
      throw new Error("Nenhum produto encontrado");
    }
    res.render("index", { 
      title: "Lista de Produtos", 
      products,
      styles: '/css/styles.css' 
    });
  } catch (error) {
    console.error("Erro na rota GET /:", error);
    res.status(500).render("error", { 
      message: "Erro ao carregar lista de produtos",
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId || productId.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        error: "invalid_id",
        message: "ID do produto não fornecido ou inválido" 
      });
    }

    try {
      const deleted = productManager.deleteProduct(productId);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false,
          error: "product_not_found",
          message: `Produto com ID ${productId} não encontrado` 
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: "Produto excluído com sucesso",
        deletedProductId: productId
      });

    } catch (dbError) {
      console.error("Erro no banco de dados:", dbError);
      throw dbError;
    }

  } catch (error) {
    console.error("Erro na rota DELETE /:id:", error);
    return res.status(500).json({ 
      success: false,
      error: "server_error",
      message: "Erro interno ao processar exclusão",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;