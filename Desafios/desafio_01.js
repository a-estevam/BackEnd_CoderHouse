

class ProductManager {
    #products
    #code = 0

    
    constructor (){
        
        this.#products = []
    }
        getProducts = () => this.#products
        addProduct = (title, description, price, thumbnail, stock) => {

            if (!title || !description || !price || !thumbnail || !stock) {
                console.error("Todos os campos são obrigatórios.");
                return;
            }

            const product = {
            title,
            description,
            price,
            thumbnail,
            code: this.#code = this.#code + 1,
            stock,
        }        
        this.#products.push(product)

        }
        getProductById = (idProduct) => {
            const product = this.#products.find((product)=> product.code === idProduct)

            if (product) {
                console.log(product)
                return product;
                
            } else {
                console.log("Produto não encontrado.");
                return null;
            }
            
            
        }

    
}

const product = new ProductManager();


product.addProduct("prata 925 - 1", "teste de descrição 1", 55, "https://p-pratas.vercel.app/assets/Ppratas_brand-BRDF9yQj.svg", 40)
product.addProduct("prata 925 - 2", "teste de descrição 2", 55, "https://p-pratas.vercel.app/assets/Ppratas_brand-BRDF9yQj.svg", 13)
product.addProduct("prata 925 - 3", "teste de descrição 3", 55, "https://p-pratas.vercel.app/assets/Ppratas_brand-BRDF9yQj.svg", 10)
product.addProduct("prata 925 - 4", "teste de descrição 3", 55, "https://p-pratas.vercel.app/assets/Ppratas_brand-BRDF9yQj.svg",5 )

console.log(product.getProducts());

product.getProductById(5)
