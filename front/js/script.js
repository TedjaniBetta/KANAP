function genererProduit(product){

// Nous affichons les produits avec l'image, le titre, le nom du produit et la description
    let link=document.createElement("a");
    link.href="./product.html?id=" + product._id;

    let article=document.createElement("article");
    link.appendChild(article);

    let img=document.createElement("img");
    img.src=product.imageUrl;
    img.alt=product.altTxt;
    article.appendChild(img);

    let h3=document.createElement("h3");
    h3.innerText=product.name;

    h3.classList.add("productName");
    article.appendChild(h3);

    let p=document.createElement("p");
    p.innerText= product.description;
    p.classList.add("productDescription");
    article.appendChild(p);

    let section=document.getElementById("items");
    section.appendChild(link);
}

// Nous récuperons les données via l'API
function main(){
    fetch("http://localhost:3000/api/products")
    .then((response)=>{
        return response.json()
    })
    .then((products)=>{
        console.log(products)
        for (const product of products) {
            genererProduit(product)
        }
    })
}

main()

// la fonction fetch permet d'envoyer des requêtes HTTP au navigateur
// fetch("http://localhost:3000/api/products") on envoie une requête pour demander les ressources des produits
