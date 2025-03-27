const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor(filePath) {
    this.filePath = path.resolve(__dirname, filePath);
    this.products = this._loadProducts();
  }

  _loadProducts() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        return [];
      }

      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      return [];
    }
  }

  _saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
      return true;
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
      return false;
    }
  }

  getAllProducts() {
    return this.products;
  }

  addProduct(product) {
    try {
      if (!product || typeof product !== "object") {
        throw new Error("Dados do produto inválidos");
      }

      const requiredFields = ['title', 'description', 'price'];
      const missingFields = requiredFields.filter(field => !product[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      }

      if (!product.id) {
        product.id = Date.now().toString();
      }

      this.products.push(product);
      const saved = this._saveProducts();
      if (!saved) {
        throw new Error("Falha ao salvar produto");
      }
      return product;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  }

  deleteProduct(productId) {
    try {
      if (!productId) {
        throw new Error("ID do produto é obrigatório");
      }

      const initialLength = this.products.length;
      this.products = this.products.filter(product => String(product.id) !== String(productId));

      if (this.products.length === initialLength) {
        throw new Error(`Produto com ID ${productId} não encontrado`);
      }

      const saved = this._saveProducts();
      if (!saved) {
        throw new Error("Falha ao salvar alterações");
      }
      return true;
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      throw error;
    }
  }
}

module.exports = ProductManager;