const socket = io.connect();

function crearTemplate(productos) {
  fetch('index.hbs')

    .then(response => response.text())

    .then(content => {

      const template = Handlebars.compile(content);


      const html = template({
        productos,
        productosExists: productos.length
      });
      document.getElementById('lstProductos').innerHTML = html;

    })
}

socket.on("products", (data) => {
  console.log(data);
  crearTemplate(data);
});

function addProduct(e) {
  const product = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
  };
  socket.emit("new-product", product);

  return false;
}

function render(data) {
  const html = data
    .map((elem) => {
      return `<div>
      <em style="color:red">${(new Date(elem.time)).toLocaleString('es-AR')}</em>
            <strong style="color:blue">${elem.author.id}</strong>
            <em style="color:green">${elem.message}</em>
             <img width=30px src="${elem.author.avatar}">
        </div>`;
    })
    .join("");
  document.getElementById("messages").innerHTML = html;
}



socket.on("messages", (data) => {
  console.log('mensaje')
  console.log(data)
  const messages = data;//esto muy importante porque el formato no es como json requerido
  const author = new normalizr.schema.Entity('author')
  const messageSchema = new normalizr.schema.Entity('mensaje', {
    author: author,
  }, { idAttribute: '_id' })
  const post = new normalizr.schema.Entity('post', {
    messages: [messageSchema],
  })
  //const temp = { id: 'mensajes', messages }



  const mensajesData = normalizr.denormalize(messages.result, post, messages.entities)
  const porc = Math.floor(-100 + (JSON.stringify(data).length * 100) / JSON.stringify(mensajesData.messages).length)

  document.getElementById('compresion').innerText = porc
  console.log(mensajesData.messages)
  render(mensajesData.messages);
});


function addMessage(e) {
  const mensaje = {
    author: {
      id: document.getElementById("username").value,
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      edad: document.getElementById("edad").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },
    message: document.getElementById("texto").value,
    time: + new Date(),
  };
  socket.emit("new-message", mensaje);
  document.getElementById("texto").value = '';

  return false;
}