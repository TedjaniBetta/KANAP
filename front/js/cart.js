let cart_items=JSON.parse(localStorage.getItem("cart_items"))  // récuperer les données de notre localstorage
let div=document.querySelector("#cart__items") 

// Fonction qui nous permet d'afficher les produits
function displayItems(){
    let i = 0;
    for (const item of cart_items) {
        getItem(item, i);
        i++;
    }
    
}

// Fonction qui nous permet de récuperer les images, les prix, les noms des produits
function getItem(item, i){
    fetch("http://localhost:3000/api/products/" + item.id)
    .then((response)=>{
        return response.json()
    })
    .then((product)=>{
        displayOneItem(product, item)
        cart_items[i].imageUrl=product.imageUrl;
        cart_items[i].price=product.price;
        cart_items[i].name=product.name;
        cart_items[i].altText=product.altText;
        displayTotalPriceArticle();
        displayTotalArticle();
        changeQuantityListeners();
        deleteListeners();
    })
}

//Fonction qui nous permet d'afficher les produits
function displayOneItem(product, item){
    div.innerHTML +=`<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
<div class="cart__item__img">
  <img src="${product.imageUrl}" alt="Photographie d'un canapé">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${product.name}</h2>
    <p>${item.color}</p>
    <p>${product.price}€</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>
</article>`;

}


// Fonction qui affiche le total des articles dans le panier
function displayTotalArticle(){
  let totalQuantity= 0;
  let totalQuantityDiv=document.getElementById("totalQuantity")

  for (item of cart_items){
    totalQuantity+=parseInt(item.quantity);
  }
  totalQuantityDiv.innerText=totalQuantity
  
}

// Focntion qui affiche le total prix des articles dans le panier
function displayTotalPriceArticle(){
  let totalPrice= 0;
  let totalPriceDiv=document.getElementById("totalPrice")
  for (item of cart_items) {
    totalPrice+=item.quantity*item.price;
  }
  totalPriceDiv.innerText=totalPrice;
  
}

function changeQuantityListeners(){
  let items = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < items.length; i++){
    items[i].addEventListener("change", ()=>{
      let newQuantity = parseInt(items[i].value); // Convertir la valeur en nombre entier
      let selectedId = items[i].closest("article").dataset.id;
      let selectedColor = items[i].closest("article").dataset.color;
      let searchIndex = cart_items.findIndex(item => item.color == selectedColor && item.id == selectedId);
      
      if (newQuantity < 1) { // Vérifie si la nouvelle quantité est inférieure à 1
        newQuantity = 1; // Si c'est le cas, la quantité minimale est fixée à 1
        items[i].value = newQuantity; // Mettre à jour la valeur de l'input avec la quantité minimale
      }

      if (searchIndex !== -1) { // Vérifie si l'article est trouvé dans le panier
        cart_items[searchIndex].quantity = newQuantity;
        localStorage.setItem("cart_items", JSON.stringify(cart_items));
        displayTotalPriceArticle();
        displayTotalArticle();
      }
    });
  }
}

// Fonction qui permet de supprimer un article du panier
function deleteListeners(){
  let items = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < items.length; i++){
    items[i].addEventListener("click", ()=>{
      let selectedId = items[i].closest("article").dataset.id;
      let selectedColor = items[i].closest("article").dataset.color;
      let searchIndex = cart_items.findIndex(item => item.color == selectedColor && item.id == selectedId);
      
      if (searchIndex !== -1) { // Vérifie si l'article est trouvé dans le panier
        cart_items.splice(searchIndex, 1); // Supprime uniquement l'article trouvé
        items[i].closest("article").remove();
        localStorage.setItem("cart_items", JSON.stringify(cart_items));
        displayTotalPriceArticle();
        displayTotalArticle();
      } else {
        console.log("Article not found in cart."); // Affiche un message d'erreur si l'article n'est pas trouvé dans le panier
      }
    })
  }
}

// Ajout du Event Listener pour le bouton "commander ", avec l'empêchement de l'actualisation de la page poru chaque suppression
let submitBtn=document.getElementById("order")
submitBtn.addEventListener("click", (event)=>{
  event.preventDefault();
  console.log("submitBtn");
  let validForm=checkFormulaire();
  if (validForm == true){
    confirmation();
  }
  console.log(validForm);
})

// Fonction qui permet de vérifier le formulaire
function checkFormulaire(){
  let firstName=document.getElementById("firstName").value
  let lastName=document.getElementById("lastName").value
  let address=document.getElementById("address").value
  let city=document.getElementById("city").value
  let email=document.getElementById("email").value
  // Nous avons ajouter les caractères que nous devons seulement retrouver dans le nom, prénom,email,adresse et ville
  let nameRegex=/^[A-Za-zÀ-ÿ\-']{1,}$/        
  let emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  let addressRegex=/^[A-Za-z0-9À-ÿ\-',.\s]+$/
  let cityRegex=/^[A-Za-zÀ-ÿ\-'\s]+$/
  let validForm=true;

  // Des conditions qui permette d'afficher un messages d'erreur si le formulaire comporte des erreurs
  if (nameRegex.test(firstName) == false){
    validForm=false;
    document.getElementById("firstNameErrorMsg").textContent="Veuillez renseigner correctement le prénom svp!"
  }
  else{
    document.getElementById("firstNameErrorMsg").textContent=""
  }
  if (nameRegex.test(lastName) == false){
    validForm=false;
    document.getElementById("lastNameErrorMsg").textContent="Veuillez renseigner correctement le nom svp!"
  }
  else{
    document.getElementById("lastNameErrorMsg").textContent=""
  }
  if (addressRegex.test(address) == false){
    validForm=false;
    document.getElementById("addressErrorMsg").textContent="Veuillez renseigner correctement l'adresse svp!"
  }
  else{
    document.getElementById("addressErrorMsg").textContent=""
  }
  if (cityRegex.test(city) == false){
    validForm=false;
    document.getElementById("cityErrorMsg").textContent="Veuillez renseigner correctement la ville svp!"
  }
  else{
    document.getElementById("cityErrorMsg").textContent=""
  }
  if (emailRegex.test(email) == false){
    validForm=false;
    document.getElementById("emailErrorMsg").textContent="Veuillez renseigner correctement l'adresse Email svp!"
  }
  else{
    document.getElementById("emailErrorMsg").textContent=""
  }
  return  validForm;
}


function confirmation(){
  let firstName=document.getElementById("firstName").value
  let lastName=document.getElementById("lastName").value
  let address=document.getElementById("address").value
  let city=document.getElementById("city").value
  let email=document.getElementById("email").value
  let productIds=[];
  for (const item of cart_items) {
    productIds.push(item.id);
  }
  if (productIds.length >= 1){
    let order={
      contact:{
        firstName:firstName,
        lastName:lastName,
        address:address,
        email:city,
        city:email,
      },
      products:productIds
    };
    fetch("http://localhost:3000/api/products/order", {
      method:"POST",
      body:JSON.stringify(order),
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data.orderId){
        location.href="confirmation.html?orderId=" + data.orderId
      }
      console.log(data.orderId);
    })
    .catch((erreur)=> {
      console.log(erreur);
    })
    console.log(order)
  }
  else{
    alert("Votre panier est vide veuillez choisir un produit!")
  }
}


displayItems();