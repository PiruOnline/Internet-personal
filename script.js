const products = {

  personal7:{
    name:"CGLite Personal",
    info:"7 días · Línea Personal",
    price:4500
  },

  personal15:{
    name:"CGLite Personal",
    info:"15 días · Línea Personal",
    price:6000
  },

  personal30:{
    name:"CGLite Personal",
    info:"30 días · Línea Personal",
    price:8000
  },

  claro7:{
    name:"CGLite Claro AR",
    info:"7 días · Línea Claro",
    price:4500
  },

  claro15:{
    name:"CGLite Claro AR",
    info:"15 días · Línea Claro",
    price:6000
  },

  claro30:{
    name:"CGLite Claro AR",
    info:"30 días · Línea Claro",
    price:8000
  },

  http1:{
    name:"HTTP Custom Personal",
    info:"30 días · 1 dispositivo",
    price:7000
  },

  http2:{
    name:"HTTP Custom Personal",
    info:"30 días · 2 dispositivos",
    price:12000
  }

};


let cart = [];


function money(value){

  return "$" + value.toLocaleString("es-AR");

}


function addToCart(id){

  cart.push(id);

  updateCart();

  openCart();

  showToast();

}


function removeItem(index){

  cart.splice(index,1);

  updateCart();

}


function clearCart(){

  cart = [];

  updateCart();

}


function updateCart(){

  const container = document.getElementById("cartItems");
  const count = document.getElementById("cartCount");
  const total = document.getElementById("cartTotal");

  count.textContent = cart.length;

  if(cart.length === 0){

    container.innerHTML = `
      <div class="empty">
        <div>🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agregá un plan para comenzar.</p>
      </div>
    `;

    total.textContent = "$0";

    return;

  }


  let totalPrice = 0;

  container.innerHTML = cart.map((id,index)=>{

    const item = products[id];

    totalPrice += item.price;

    return `
      <div class="cart-item">

        <div>
          <strong>${item.name}</strong>
          <small>${item.info}</small>
        </div>

        <div>
          <strong>${money(item.price)}</strong>
          <button onclick="removeItem(${index})">Eliminar</button>
        </div>

      </div>
    `;

  }).join("");


  total.textContent = money(totalPrice);

}


function openCart(){

  document.getElementById("cart").classList.add("active");

  document.getElementById("overlay").classList.add("active");

}


function closeCart(){

  document.getElementById("cart").classList.remove("active");

  document.getElementById("overlay").classList.remove("active");

}


function showToast(){

  const toast = document.getElementById("toast");

  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },1800);

}


function sendWhatsApp(){

  if(cart.length === 0){

    alert("Agregá al menos un plan al pedido.");

    return;

  }


  const name =
    document.getElementById("customerName").value.trim();

  const phone =
    document.getElementById("customerPhone").value.trim();


  if(!name){

    alert("Ingresá tu nombre.");

    return;

  }


  if(!phone){

    alert("Ingresá tu número de teléfono.");

    return;

  }


  let total = 0;

  let message =
`Hola PERSONALNET 👋

Quiero realizar este pedido:

`;


  cart.forEach(id=>{

    const item = products[id];

    total += item.price;

    message +=
`• ${item.name} — ${item.info} — ${money(item.price)}
`;

  });


  message +=
`
━━━━━━━━━━━━━━

Total: ${money(total)}
Nombre: ${name}
Teléfono: ${phone}

Quedo atento/a. Gracias.`;


  const url =
    "https://wa.me/5493844546841?text=" +
    encodeURIComponent(message);


  window.open(url,"_blank");

}


/* FILTROS */

document.querySelectorAll(".filter").forEach(button=>{

  button.addEventListener("click",()=>{

    document
      .querySelectorAll(".filter")
      .forEach(btn=>btn.classList.remove("active"));

    button.classList.add("active");

    const filter = button.dataset.filter;

    document.querySelectorAll(".plan").forEach(plan=>{

      const days = plan.dataset.days;

      if(filter === "all" || days === filter){

        plan.style.display = "";

      }else{

        plan.style.display = "none";

      }

    });

  });

});


/* REVEAL */

const observer =
new IntersectionObserver(
(entries)=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

    }

  });

},
{
  threshold:.08
});


document
  .querySelectorAll(".service-card,.plan,.step,details")
  .forEach(el=>{

    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";

    observer.observe(el);

  });


updateCart();
