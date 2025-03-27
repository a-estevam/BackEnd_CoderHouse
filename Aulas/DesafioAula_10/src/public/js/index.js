const socket = io();

document.getElementById("productForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productData = Object.fromEntries(formData);

  const response = await fetch("/realTimeProducts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  const result = await response.json();
  if (response.ok) {
    socket.emit("newProduct", result.product);
    alert(result.message);
    event.target.reset();
  } else {
    alert("Erro ao cadastrar produto: " + result.error);
  }
});

socket.on("newProduct", (product) => {
  const productList = document.getElementById("productList");
  const newProductItem = document.createElement("li");
  newProductItem.dataset.id = product.id;
  newProductItem.innerHTML = `
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <img src="${product.thumbnail}" alt="${product.title}" style="max-width: 150px;" />
    <p><strong>Preço:</strong> R$ ${product.price}</p>
    <p><strong>Estoque:</strong> ${product.stock}</p>
    <p><strong>Categoria:</strong> ${product.category}</p>
    <p><strong>Status:</strong> ${product.status}</p>
    <button onclick="deleteProduct('${product.id}')">Remover</button>
  `;
  productList.appendChild(newProductItem);
});

async function deleteProduct(productId) {
  const response = await fetch(`/realTimeProducts/${productId}`, { method: "DELETE" });

  const result = await response.json();
  if (result.success) {
    socket.emit("deleteProduct", productId);
  } else {
    alert("Erro ao excluir produto.");
  }
}

socket.on("deletedProduct", (productId) => {
  const productItem = document.querySelector(`li[data-id="${productId}"]`);
  if (productItem) {
    productItem.remove();
  }
});
