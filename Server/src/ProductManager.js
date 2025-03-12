const fs = require("fs").promises;
const path = require("path");

class ProductManager {
    #code = 0;

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

    addProduct = async (title, description, price, thumbnail, stock) => {
        const products = await this.#lerArquivo();
        const productExists = products.some((product) => product.title === title);
        if (productExists) {
            console.log("Erro: Produto já existe.");
            return;
        }

        const product = {
            title,
            description,
            price,
            thumbnail,
            code: (this.#code = this.#code + 1),
            stock,
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

// const main = async () => {
//     const products = new ProductManager("./data/products.json");

//     await products.addProduct(
//         "prata 925 - 1",
//         "teste de descrição 1",
//         55,
//         "https://p-pratas.vercel.app/assets/Ppratas_brand-BRDF9yQj.svg",
//         40
//     );

//     const productList = await products.getProducts();
//     console.log("Lista de produtos:", productList);

//     await products.updateProduct(1, {
//         title: "prata 925 - atualizado",
//         price: 60,
//         stock: 50,
//     });

//     const updatedProductList = await products.getProducts();
//     console.log("Lista de produtos atualizada:", updatedProductList);

//     await products.deleteProduct(1);

//     const finalProductList = await products.getProducts();
//     console.log("Lista de produtos após exclusão:", finalProductList);
// };

// main()




module.exports = ProductManager;  
