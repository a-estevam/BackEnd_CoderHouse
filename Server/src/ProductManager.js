const fs = require("fs").promises;
const path = require("path");

class ProductManager {
    #code = 0;
    #pid = 1;
    #status = true

    constructor(filePath) {
        this.path = path.join(__dirname, filePath);
        this.#criarArquivo();
    }

    #criarArquivo = async () => {
        try {
            const dir = path.dirname(this.path);
            await fs.mkdir(dir, { recursive: true });
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, "[]");
        }
    };

    #lerArquivo = async () => {
        const resultado = await fs.readFile(this.path, "utf-8");
        return JSON.parse(resultado);
    };

    #escreverArquivo = async (data) => {
        const dataToSave = JSON.stringify(data, null, 2);
        await fs.writeFile(this.path, dataToSave);
    };

    getProducts = async () => {
        return await this.#lerArquivo();
    };

    addProduct = async (pid, title, description, price, thumbnail, stock, status, category) => {
        const products = await this.#lerArquivo();
        const productExists = products.some((product) => product.title === title);
        if (productExists) {
            console.log("Erro: Produto já existe.");
            return;
        }

        const product = {
            pid: this.#pid = this.#pid + 1 ,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
        };

        products.push(product);
        await this.#escreverArquivo(products);
        console.log("Produto adicionado com sucesso!");
    };

    getProductById = async (idProduct) => {
        const products = await this.#lerArquivo();
        const product = products.find((product) => product.code === idProduct);

        if (product) {
            console.log("Produto encontrado:", product);
            return product;
        } else {
            console.log("Erro: Produto não encontrado.");
            return null;
        }
    };

    updateProduct = async (idProduct, updatedFields) => {
        const products = await this.#lerArquivo();
        const productIndex = products.findIndex((product) => product.code === idProduct);

        if (productIndex === -1) {
            console.log("Erro: Produto não encontrado.");
            return;
        }

        const productToUpdate = products[productIndex];

        Object.keys(updatedFields).forEach((key) => {
            if (key !== "code") {
                productToUpdate[key] = updatedFields[key];
            }
        });

        products[productIndex] = productToUpdate;
        await this.#escreverArquivo(products);
        console.log("Produto atualizado com sucesso!");
    };

    deleteProduct = async (idProduct) => {
        const products = await this.#lerArquivo();
        const productIndex = products.findIndex((product) => product.code === idProduct);

        if (productIndex === -1) {
            console.log("Erro: Produto não encontrado.");
            return;
        }

        products.splice(productIndex, 1);
        await this.#escreverArquivo(products);
        console.log("Produto deletado com sucesso!");
    };
}




module.exports = ProductManager;  
