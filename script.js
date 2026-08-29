/* =========================================================
   PERSONALNET
   SISTEMA DE CARRITO
   ========================================================= */


/* =========================
   CONFIGURACIÓN
========================= */

const MP_LINK =
  "https://link.mercadopago.com.ar/pirunet";

const ADMIN_WHATSAPP =
  "5493844546841";


/* =========================
   ESTADO
========================= */

let cart = [];

let customer = {
  name: "",
  phone: ""
};


/* =========================
   ELEMENTOS
========================= */

const cartOverlay =
  document.getElementById("cartOverlay");

const afterOverlay =
  document.getElementById("afterOverlay");

const cartItems =
  document.getElementById("cartItems");

const cartCount =
  document.getElementById("cartCount");

const cartTotal =
  document.getElementById("cartTotal");

const emptyCart =
  document.getElementById("emptyCart");

const cartBottom =
  document.getElementById("cartBottom");

const cartError =
  document.getElementById("cartError");

const customerName =
  document.getElementById("customerName");

const customerPhone =
  document.getElementById("customerPhone");

const sendWhatsApp =
  document.getElementById("sendWhatsApp");


/* =========================
   CARGAR CARRITO
========================= */

function loadCart(){

  try{

    const saved =
      localStorage.getItem("personalnet_cart");

    if(saved){

      cart = JSON.parse(saved);

    }

  }catch(error){

    console.error(
      "No se pudo cargar el carrito:",
      error
    );

    cart = [];

  }

  renderCart();
}


/* =========================
   GUARDAR CARRITO
========================= */

function saveCart(){

  localStorage.setItem(
    "personalnet_cart",
    JSON.stringify(cart)
  );

}


/* =========================
   FORMATO DINERO
========================= */

function money(value){

  return "$" +
    Number(value).toLocaleString("es-AR");

}


/* =========================
   AGREGAR AL CARRITO
========================= */

function addToCart(name, price){

  const existing =
    cart.find(item => item.name === name);


  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({

      id:
        Date.now() +
        Math.random(),

      name: name,

      price: Number(price),

      quantity: 1

    });

  }


  saveCart();

  renderCart();

  openCart();

  showAddedMessage();

}


/* =========================
   CAMBIAR CANTIDAD
========================= */

function changeQuantity(id, amount){

  const item =
    cart.find(product => product.id === id);


  if(!item){

    return;

  }


  item.quantity += amount;


  if(item.quantity <= 0){

    cart =
      cart.filter(
        product => product.id !== id
      );

  }


  saveCart();

  renderCart();

}


/* =========================
   ELIMINAR PRODUCTO
========================= */

function removeItem(id){

  cart =
    cart.filter(
      product => product.id !== id
    );


  saveCart();

  renderCart();

}


/* =========================
   VACIAR CARRITO
========================= */

function clearCart(){

  cart = [];

  saveCart();

  renderCart();

}


/* =========================
   RENDERIZAR CARRITO
========================= */

function renderCart(){

  cartItems.innerHTML = "";


  let totalItems = 0;

  let totalPrice = 0;


  if(cart.length === 0){

    emptyCart.classList.remove(
      "hidden"
    );

    cartBottom.classList.add(
      "hidden"
    );

  }else{

    emptyCart.classList.add(
      "hidden"
    );

    cartBottom.classList.remove(
      "hidden"
    );


    cart.forEach(item => {

      const subtotal =
        item.price *
        item.quantity;


      totalItems +=
        item.quantity;


      totalPrice +=
        subtotal;


      const element =
        document.createElement("div");


      element.className =
        "cart-item";


      element.innerHTML = `

        <div class="cart-item-info">

          <div class="cart-item-name">
            ${escapeHTML(item.name)}
          </div>

          <div class="cart-item-price">
            ${money(subtotal)}
          </div>

        </div>


        <div class="cart-item-controls">

          <button
            class="qty-btn"
            onclick="changeQuantity(${item.id}, -1)">
            −
          </button>

          <span class="qty">
            ${item.quantity}
          </span>

          <button
            class="qty-btn"
            onclick="changeQuantity(${item.id}, 1)">
            +
          </button>

          <button
            class="remove-btn"
            onclick="removeItem(${item.id})"
            title="Eliminar">
            🗑️
          </button>

        </div>

      `;


      cartItems.appendChild(
        element
      );

    });

  }


  cartCount.textContent =
    totalItems;


  cartTotal.textContent =
    money(totalPrice);

}


/* =========================
   ESCAPAR HTML
========================= */

function escapeHTML(value){

  const div =
    document.createElement("div");

  div.textContent =
    value;

  return div.innerHTML;

}


/* =========================
   ABRIR CARRITO
========================= */

function openCart(){

  cartOverlay.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "locked"
  );

}


/* =========================
   CERRAR CARRITO
========================= */

function closeCart(){

  cartOverlay.classList.add(
    "hidden"
  );

  document.body.classList.remove(
    "locked"
  );

}


/* =========================
   MENSAJE DE PRODUCTO AGREGADO
========================= */

function showAddedMessage(){

  const old =
    document.getElementById(
      "addedMessage"
    );


  if(old){

    old.remove();

  }


  const message =
    document.createElement("div");


  message.id =
    "addedMessage";


  message.textContent =
    "✓ Producto agregado al carrito";


  message.style.position =
    "fixed";

  message.style.left =
    "50%";

  message.style.bottom =
    "25px";

  message.style.transform =
    "translateX(-50%)";

  message.style.zIndex =
    "300";

  message.style.padding =
    "12px 17px";

  message.style.borderRadius =
    "12px";

  message.style.background =
    "#00d084";

  message.style.color =
    "#03120c";

  message.style.fontSize =
    "12px";

  message.style.fontWeight =
    "900";

  message.style.boxShadow =
    "0 10px 30px rgba(0,0,0,.4)";


  document.body.appendChild(
    message
  );


  setTimeout(() => {

    message.remove();

  }, 1800);

}


/* =========================
   PEDIR PRUEBA
========================= */

function requestTrial(service){

  const message =
`🧪 SOLICITUD DE PRUEBA

Hola, quiero solicitar una prueba de ${service}.

📱 Quiero comprobar si funciona correctamente en mi dispositivo antes de contratar.

Gracias.`;


  const url =
    "https://wa.me/" +
    ADMIN_WHATSAPP +
    "?text=" +
    encodeURIComponent(message);


  window.open(
    url,
    "_blank"
  );

}


/* =========================
   CHECKOUT
========================= */

function checkout(){

  cartError.textContent = "";


  if(cart.length === 0){

    cartError.textContent =
      "Tu carrito está vacío.";

    return;

  }


  const name =
    customerName.value.trim();


  const phone =
    customerPhone.value.trim();


  if(name.length < 2){

    cartError.textContent =
      "Ingresá tu nombre.";

    customerName.focus();

    return;

  }


  if(phone.length < 6){

    cartError.textContent =
      "Ingresá un número de WhatsApp válido.";

    customerPhone.focus();

    return;

  }


  customer.name =
    name;

  customer.phone =
    phone;


  const orderMessage =
    createOrderMessage();


  const whatsappURL =
    "https://wa.me/" +
    ADMIN_WHATSAPP +
    "?text=" +
    encodeURIComponent(
      orderMessage
    );


  localStorage.setItem(
    "personalnet_customer",
    JSON.stringify(customer)
  );


  localStorage.setItem(
    "personalnet_order",
    orderMessage
  );


  localStorage.setItem(
    "personalnet_order_wa",
    whatsappURL
  );


  /*
    Abrimos Mercado Pago.
  */

  window.open(
    MP_LINK,
    "_blank"
  );


  closeCart();


  /*
    Mostramos el paso para enviar
    comprobante.
  */

  setTimeout(() => {

    showAfterPayment();

  }, 600);

}


/* =========================
   CREAR MENSAJE DEL PEDIDO
========================= */

function createOrderMessage(){

  let products = "";

  let total = 0;


  cart.forEach(item => {

    const subtotal =
      item.price *
      item.quantity;


    total += subtotal;


    products +=
      `• ${item.name} x${item.quantity} — ${money(subtotal)}\n`;

  });


  return `🛒 NUEVA CONTRATACIÓN

👤 Cliente: ${customer.name}
📱 WhatsApp: ${customer.phone}

📦 PRODUCTOS:
${products}
💰 TOTAL: ${money(total)}

💳 Pago realizado mediante Mercado Pago.

📎 Voy a enviar el comprobante de pago.`;

}


/* =========================
   DESPUÉS DEL PAGO
========================= */

function showAfterPayment(){

  const url =
    localStorage.getItem(
      "personalnet_order_wa"
    );


  if(url){

    sendWhatsApp.href =
      url;

  }


  afterOverlay.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "locked"
  );

}


/* =========================
   CERRAR DESPUÉS DEL PAGO
========================= */

function closeAfterPayment(){

  afterOverlay.classList.add(
    "hidden"
  );

  document.body.classList.remove(
    "locked"
  );

}


/* =========================
   BOTONES
========================= */

document
  .getElementById("openCart")
  .addEventListener(
    "click",
    openCart
  );


document
  .getElementById("closeCart")
  .addEventListener(
    "click",
    closeCart
  );


document
  .getElementById("clearCart")
  .addEventListener(
    "click",
    clearCart
  );


document
  .getElementById("checkoutButton")
  .addEventListener(
    "click",
    checkout
  );


document
  .getElementById("closeAfter")
  .addEventListener(
    "click",
    closeAfterPayment
  );


/* =========================
   CERRAR TOCANDO AFUERA
========================= */

cartOverlay.addEventListener(
  "click",
  function(event){

    if(
      event.target ===
      cartOverlay
    ){

      closeCart();

    }

  }
);


afterOverlay.addEventListener(
  "click",
  function(event){

    if(
      event.target ===
      afterOverlay
    ){

      closeAfterPayment();

    }

  }
);


/* =========================
   ESC PARA CERRAR
========================= */

document.addEventListener(
  "keydown",
  function(event){

    if(event.key !== "Escape"){

      return;

    }


    if(
      !cartOverlay.classList.contains(
        "hidden"
      )
    ){

      closeCart();

    }


    if(
      !afterOverlay.classList.contains(
        "hidden"
      )
    ){

      closeAfterPayment();

    }

  }
);


/* =========================
   CARGAR DATOS DEL CLIENTE
========================= */

function loadCustomer(){

  try{

    const saved =
      localStorage.getItem(
        "personalnet_customer"
      );


    if(!saved){

      return;

    }


    const data =
      JSON.parse(saved);


    if(data.name){

      customerName.value =
        data.name;

    }


    if(data.phone){

      customerPhone.value =
        data.phone;

    }

  }catch(error){

    console.error(
      "Error cargando cliente:",
      error
    );

  }

}


/* =========================
   INICIO
========================= */

loadCart();

loadCustomer();
