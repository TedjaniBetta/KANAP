const Url=window.location.search
const UrlParams=new URLSearchParams(Url)
const orderId=UrlParams.get("orderId")

let orderIdd=document.getElementById("orderId")
orderIdd.innerText=orderId;
localStorage.setItem("cart_items", "[]")
console.log(orderId)