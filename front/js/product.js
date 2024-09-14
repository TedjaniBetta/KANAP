const Url=window.location.search
const UrlParams=new URLSearchParams(Url)
const id=UrlParams.get("id")
console.log(id)

// Fonction qui nous permet d'afficher les information des produits tel que le prix, l'image, le prix, la description; la couleur,
function afficherInformation(product){

    // Nous récupérons les détails des produits via des querySelector, des ID pour les afficher
    let img=document.createElement("img");
    img.src=product.imageUrl;
    img.alt=product.altTxt;
    let div=document.querySelector(".item__img")
    div.appendChild(img)

    let title=document.getElementById("title")
    title.innerText=product.name

    let prix=document.getElementById("price")
    prix.innerText=product.price

    let description=document.getElementById("description")
    description.innerText=product.description

    // Nous pouvons choisir la couleur de notre produit
    console.log(product.colors)
    let select=document.querySelector("#colors")
    for (const color of product.colors) {
        let option=document.createElement("option")
        option.innerText=color
        select.appendChild(option)
    }
}

// Fonction d'ajout d'un Event Listener clik pour ajouter les produits au panier
function addProductListener(){
    let addtocardbutton=document.querySelector("#addToCart")
    addtocardbutton.addEventListener("click", () => {
        addToCard()
    })
}

// Fonction qui permet de choisir la couleur ainsi que la quantité 
function addToCard(){
    let color=document.querySelector("#colors").value
    let quantity=document.querySelector("#quantity").value
    // Condition pour gerer les cas d'erreur
    if (quantity <= 0 || quantity > 100 || !color){
        alert("Veuillez choisir une couleur et une quantité valide !")
        return;
    }
    // L'ID, la quantité, la couleur, le prix sont stocké dans un objet
    else{
        let item={
            "id":id,
            "quantity":quantity,
            "color":color,
            "price":price,
        };
        let cart_items=[];
        let cart_InLocalstorage=localStorage.getItem("cart_items");
        // Cette condition nous permet de vérifier si c'est un utilisateur qui a déjà mis dans le panier des articles ou non
        if (cart_InLocalstorage != null){
            cart_items=JSON.parse(cart_InLocalstorage);
        }
        let searchIndex=cart_items.findIndex(item => item.color==color && item.id==id)
        // Condition pour calculer l'ancienne quantité + la nouvelle 
        // Si notre index et supérieur ou égal à 0 alors nous allons calculer l'ancienne quantité + la nouvelle pour nous donner la nouvelle quantité
        if (searchIndex >= 0){
            console.log(cart_items[searchIndex])
            let oldquantity=parseInt(cart_items[searchIndex].quantity)
            let newquantity=oldquantity + parseInt(quantity)
            cart_items[searchIndex].quantity = newquantity
        }
        // Sinon nous ajoutons les items actuels 
        else {
            cart_items.push(item)
        }
        // On convertis une valeur en chaine de caractère qu'on retrouve grâce à la clé et la valeur
        localStorage.setItem("cart_items", JSON.stringify(cart_items));
    }
}

// Fonction Main Fetch pour récuperer les donnée via l'API sur les produits
function main(){
    fetch("http://localhost:3000/api/products/" + id)
    .then((response)=>{
        return response.json()
    })
    .then((product)=>{
        afficherInformation(product)
    })
}

main()
addProductListener()
