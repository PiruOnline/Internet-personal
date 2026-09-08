const products={
"cg-personal-7":{name:"CGLite",line:"Personal",info:"7 días · Línea Personal",price:4500},
"cg-personal-15":{name:"CGLite",line:"Personal",info:"15 días · Línea Personal",price:6000},
"cg-personal-30":{name:"CGLite",line:"Personal",info:"30 días · Línea Personal",price:8000},
"cg-claro-7":{name:"CGLite",line:"Claro AR",info:"7 días · Línea Claro",price:4500},
"cg-claro-15":{name:"CGLite",line:"Claro AR",info:"15 días · Línea Claro",price:6000},
"cg-claro-30":{name:"CGLite",line:"Claro AR",info:"30 días · Línea Claro",price:8000},
"http-1":{name:"HTTP Custom",line:"Personal",info:"30 días · 1 dispositivo",price:7000},
"http-2":{name:"HTTP Custom",line:"Personal",info:"30 días · 2 dispositivos",price:13000}
};

let cart=JSON.parse(localStorage.getItem("personalnet_cart")||"[]");

const $=s=>document.querySelector(s);
const money=n=>"$"+n.toLocaleString("es-AR");

function save(){localStorage.setItem("personalnet_cart",JSON.stringify(cart))}

function total(){
return cart.reduce((s,x)=>s+x.price,0)
}

function toast(t){
$("#toastText").textContent=t;
$("#toast").classList.add("show");
setTimeout(()=>$("#toast").classList.remove("show"),2200)
}

function render(){

$("#cartCount").textContent=cart.length;
$("#cartTotal").textContent=money(total());

if(!cart.length){
$("#cartItems").innerHTML="";
$("#emptyCart").style.display="block";
return
}

$("#emptyCart").style.display="none";

$("#cartItems").innerHTML=cart.map((x,i)=>`
<div class="cart-item">
<div class="cart-item-top">
<strong>${x.name} · ${x.line}</strong>
<b>${money(x.price)}</b>
</div>
<small>${x.info}</small>
<button class="remove" onclick="removeItem(${i})">Eliminar</button>
</div>
`).join("")
}

function add(id){
if(!products[id])return;
cart.push(products[id]);
save();
render();
toast("Plan agregado al carrito ✓");
openCart()
}

function removeItem(i){
cart.splice(i,1);
save();
render();
toast("Plan eliminado");
}

function openCart(){
$("#cartDrawer").classList.add("open");
$("#overlay").classList.add("show");
}

function closeCart(){
$("#cartDrawer").classList.remove("open");
$("#overlay").classList.remove("show");
}

document.querySelectorAll(".buy").forEach(b=>{
b.addEventListener("click",()=>add(b.dataset.product))
});

$("#openCart").onclick=openCart;
$("#closeCart").onclick=closeCart;
$("#overlay").onclick=closeCart;

$("#clearCart").onclick=()=>{
if(!cart.length)return;
cart=[];
save();
render();
toast("Carrito vaciado");
};

document.querySelectorAll(".filter").forEach(btn=>{
btn.onclick=()=>{
document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
btn.classList.add("active");

const f=btn.dataset.filter;

document.querySelectorAll(".plan").forEach(p=>{
p.style.display=f==="all"||p.dataset.days===f?"grid":"none"
})
}
});

$("#mercadoPago").onclick=()=>{
if(!cart.length){
toast("Agregá un plan primero");
return
}
window.open("https://link.mercadopago.com.ar/pirunet","_blank")
};

$("#whatsappOrder").onclick=()=>{

if(!cart.length){
toast("Agregá un plan primero");
return
}

const name=$("#customerName").value.trim();
const phone=$("#customerPhone").value.trim();

if(!name||!phone){
toast("Completá nombre y teléfono");
return
}

let msg=`Hola PERSONALNET 👋

Quiero realizar este pedido:

`;

cart.forEach(x=>{
msg+=`• ${x.name} ${x.line} — ${x.info} — ${money(x.price)}
`
});

msg+=`
━━━━━━━━━━━━━━
Total: ${money(total())}

Nombre: ${name}
Teléfono: ${phone}`;

window.open(
"https://wa.me/5493844546841?text="+encodeURIComponent(msg),
"_blank"
)
};

$("#goPlans").onclick=e=>{
e.preventDefault();
$("#planes").scrollIntoView({behavior:"smooth"});
};

render();
