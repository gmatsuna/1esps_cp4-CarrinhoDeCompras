const productList = document.getElementById("product-list")
const cartList = document.getElementById("cart-list")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const filterCategory = document.getElementById("filter-category")
const clearCartButton = document.getElementById("clear-cart")


function init(){

    console.log("Aplicação iniciada")

    const produts = localStorage.getItem("produtos")

    if(produts){

        console.log("Produtos encontrados no localStorage")

        renderProducts()

    }else{

        console.log("Produtos NÃO encontrados no localStorage")

        loadProductsFromJSON()

    }

    renderCart()

}

init()

function loadProductsFromJSON(){

    fetch("./data/products.json")

        .then(function(response){
            return response.json()
        })

        .then(function(produts){

            console.log("Produtos carregados do JSON:", produts)

            localStorage.setItem("produtos", JSON.stringify(produts))

            renderProducts()

        })

        .catch(function(error){

            console.error("Erro ao carregar o JSON:", error)

        })

}

function renderProducts(){

    const produtosJSON = localStorage.getItem("produtos")

    const produtos = JSON.parse(produtosJSON)

    productList.innerHTML = ""

    produtos.forEach(function(produto){

        const card = document.createElement("div")

        card.classList.add("product-card")

        card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>Categoria: ${produto.categoria}</p>
            <p>Preço: R$ ${produto.preco}</p>
            <button onclick="addToCart(${produto.id})">
                Adicionar ao carrinho
            </button>
        `

        productList.appendChild(card)

    })

}

function addToCart(productId){

    const produtosJSON = localStorage.getItem("produtos")
    const produtos = JSON.parse(produtosJSON)

    const produtoSelecionado = produtos.find(function(produto){
        return produto.id === productId
    })

    const carrinhoJSON = localStorage.getItem("carrinho")

    let carrinho = []

    if(carrinhoJSON){
        carrinho = JSON.parse(carrinhoJSON)
    }

    carrinho.push(produtoSelecionado)

    localStorage.setItem("carrinho", JSON.stringify(carrinho))

    renderCart()

}

function renderCart(){

    const carrinhoJSON = localStorage.getItem("carrinho")

    if(!carrinhoJSON){
        cartItems.innerHTML = "Carrinho vazio"
        cartTotal.innerText = "0"
        return
    }

    const carrinho = JSON.parse(carrinhoJSON)

    cartItems.innerHTML = ""

    let total = 0

    carrinho.forEach(function(produto, index){

        const item = document.createElement("div")

        item.classList.add("cart-item")

        item.innerHTML = `
            <span class="cart-name">${produto.nome}</span>

            <span class="cart-price">
                R$ ${parseFloat(produto.preco).toFixed(2)}
            </span>

            <button class="cart-remove" onclick="removeFromCart(${index})">
                Remover
            </button>
        `

        cartItems.appendChild(item)

        total += produto.preco

    })

    cartTotal.innerText = total.toFixed(2)

}

function removeFromCart(index){

    const carrinhoJSON = localStorage.getItem("carrinho")

    const carrinho = JSON.parse(carrinhoJSON)

    carrinho.splice(index, 1)

    localStorage.setItem("carrinho", JSON.stringify(carrinho))

    renderCart()

}

function filterProducts(categoria){

    const produtosJSON = localStorage.getItem("produtos")

    const produtos = JSON.parse(produtosJSON)

    let produtosFiltrados = []

    if(categoria === "Todos"){

        produtosFiltrados = produtos

    }else{

        produtosFiltrados = produtos.filter(function(produto){
            return produto.categoria === categoria
        })

    }

    renderFilteredProducts(produtosFiltrados)

}

function renderFilteredProducts(listaProdutos){

    productList.innerHTML = ""

    listaProdutos.forEach(function(produto){

        const card = document.createElement("div")

        card.classList.add("product-card")

        card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>Categoria: ${produto.categoria}</p>
            <p>Preço: R$ ${produto.preco}</p>

            <button onclick="addToCart(${produto.id})">
                Adicionar ao carrinho
            </button>
        `

        productList.appendChild(card)

    })

}

function clearCart(){

    if(confirm("Deseja realmente limpar o carrinho?")){

        localStorage.removeItem("carrinho")

        renderCart()

    }

}

function checkout(){

    const carrinhoJSON = localStorage.getItem("carrinho")

    if(!carrinhoJSON){
        alert("Seu carrinho está vazio.")
        return
    }

    const carrinho = JSON.parse(carrinhoJSON)

    let total = 0

    carrinho.forEach(function(produto){
        total += parseFloat(produto.preco)
    })

    alert("Compra finalizada! Total: R$ " + total.toFixed(2))

    localStorage.removeItem("carrinho")

    renderCart()

}