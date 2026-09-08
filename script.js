const products = {

  "cg-personal-7": {
    name: "CGLite Personal",
    info: "7 días · Línea Personal",
    days: 7,
    price: 4500
  },

  "cg-personal-15": {
    name: "CGLite Personal",
    info: "15 días · Línea Personal",
    days: 15,
    price: 6000
  },

  "cg-personal-30": {
    name: "CGLite Personal",
    info: "30 días · Línea Personal",
    days: 30,
    price: 8000
  },

  "cg-claro-7": {
    name: "CGLite Claro",
    info: "7 días · Línea Claro",
    days: 7,
    price: 4500
  },

  "cg-claro-15": {
    name: "CGLite Claro",
    info: "15 días · Línea Claro",
    days: 15,
    price: 6000
  },

  "cg-claro-30": {
    name: "CGLite Claro",
    info: "30 días · Línea Claro",
    days: 30,
    price: 8000
  },

  "http-1": {
    name: "HTTP Custom",
    info: "30 días · 1 dispositivo",
    days: 30,
    price: 7000
  },

  "http-2": {
    name: "HTTP Custom",
    info: "30 días · 2 dispositivos",
    days: 30,
    price: 12000
  }

};


let cart = [];


const $ = selector =>
  document.querySelector(selector);


const money = number =>
  "$" + number.toLocaleString("es-AR");


function render(){

  const box = $("#cartItems");

  box.innerHTML = "";


  if(!cart.length){

    $("#emptyCart").style.display = "block";

  }else{

    $("#emptyCart").style.display = "none";


    cart.forEach((product,index)=>{

      const row = document.createElement("div");

      row.className = "cart-row";


      row.innerHTML = `

        <div class="cart-row-top">

          <b>${product.name}</b>

          <strong>${money(product.price)}</strong>

        </div>

        <small>${product.info}</small>

        <button
          class="remove"
          data-index="${index}">
          Quitar
        </button>

      `;


      box.appendChild(row);

    });

  }


  $("#cartCount").textContent = cart.length;


  const total = cart.reduce(
    (sum,product) => sum + product.price,
    0
  );


  $("#cartTotal").textContent = money(total);


  box.querySelectorAll(".remove").forEach(button=>{

    button.onclick = ()=>{

      cart.splice(
        Number(button.dataset.index),
        1
      );

      render();

    };

  });

}


function openCart(){

  render();

  $("#drawer").classList.add("show");

  $("#overlay").classList.add("show");

}


function closeCart(){

  $("#drawer").classList.remove("show");

  $("#overlay").classList.remove("show");

}


document.querySelectorAll(".buy").forEach(button=>{

  button.onclick = ()=>{

    const product =
      products[button.dataset.id];

    if(!product) return;

    cart.push(product);

    openCart();

  };

});


$("#openCart").onclick = openCart;

$("#closeCart").onclick = closeCart;

$("#overlay").onclick = closeCart;


$("#clearCart").onclick = ()=>{

  cart = [];

  render();

};


document
  .querySelectorAll("#filters button")
  .forEach(button=>{

    button.onclick = ()=>{

      document
        .querySelectorAll("#filters button")
        .forEach(item =>
          item.classList.remove("active")
        );

      button.classList.add("active");


      const filter =
        button.dataset.filter;


      document
        .querySelectorAll(".plan")
        .forEach(plan=>{

          if(
            filter === "all" ||
            plan.dataset.days === filter
          ){

            plan.style.display = "";

          }else{

            plan.style.display = "none";

          }

        });

    };

  });


$("#payBtn").onclick = ()=>{

  window.open(
    "https://link.mercadopago.com.ar/pirunet",
    "_blank"
  );

};


$("#waBtn").onclick = ()=>{

  if(!cart.length){

    alert(
      "Agregá al menos un plan al carrito."
    );

    return;

  }


  const name =
    $("#customerName").value.trim() ||
    "No indicado";


  const phone =
    $("#customerPhone").value.trim() ||
    "No indicado";


  const total =
    cart.reduce(
      (sum,product) =>
        sum + product.price,
      0
    );


  const productsText =
    cart.map(product =>
      `• ${product.name} — ${product.info} — ${money(product.price)}`
    ).join("\n");


  const message =
`Hola PERSONALNET 👋

Quiero realizar este pedido:

${productsText}

Total: ${money(total)}

Nombre: ${name}
Teléfono: ${phone}`;


  const url =
    "https://wa.me/5493844546841?text=" +
    encodeURIComponent(message);


  window.open(url,"_blank");

};


render();
