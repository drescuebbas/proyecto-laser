let port;
let reader;
let decoder = new TextDecoder();

let pot = 0;
let potSuave = 0;

let conectado = false;

// color actual del pincel
let r, g, b;

let ws;
let valorPot = 0;

function setup() {

  createCanvas(600, 700);

  background(30);

  // primer color aleatorio
  nuevoColor();

  // // botón conexión ESP32
  // let boton = createButton("Conectar ESP32");
  // boton.position(10, 10);
  // boton.mousePressed(conectarSerial);
  setTimeout(() => {
        ws = new WebSocket("ws://172.20.10.3:81");

        ws.onopen = () => console.log("Conectado al ESP32");
        ws.onclose = () => console.log("Desconectado");
        ws.onerror = (e) => console.error("Error WebSocket:", e);

        ws.onmessage = (event) => {
        let raw = event.data.trim();
        if (raw !== "") valorPot = int(raw);
        console.log("Recibido:", raw);
        };
    }, 1000);


  ws = new WebSocket('ws://172.20.10.3:81'); 
  
  // ws.onmessage = (e) => {
  //   valorPot = int(e.data);
  // };
}

function draw() {

  // // 🔥 suavizado del potenciómetro
  // potSuave = lerp(potSuave, pot, 0.05);

  dibujar();
   
  mostrarInfo();

  //  let diametro = map(valorPot, 0, 4095, 10, 350);
  // fill(79, 195, 247);
  // circle(width / 2, height / 2, diametro);
}

// =========================
// DIBUJO
// =========================

function dibujar() {

  if (mouseIsPressed) {

    // color fijo actual
    stroke(r, g, b);

    // grosor controlado por potenciómetro
    let grosor = map(
      valorPot,
      0,
      4095,
      10,
      50
    );

    strokeWeight(grosor);

    line(
      pmouseX,
      pmouseY,
      mouseX,
      mouseY
    );
  }
}

// =========================
// NUEVO COLOR RANDOM RGB
// =========================

function nuevoColor() {

  r = random(255);
  g = random(255);
  b = random(255);
}

// =========================
// LIMPIAR Y CAMBIAR COLOR
// =========================

function keyPressed() {

  if (key === 'r' || key === 'R') {

    // borrar fondo
    background(30);

    // nuevo color random
    nuevoColor();
  }
}

// =========================
// INFO
// =========================

function mostrarInfo() {

  noStroke();

  fill(0);
  rect(0, height - 40, width*3/4, 40);

  fill(255);

  textSize(14);

  text("Pot: " + int(valorPot), width/60, height - 15);

  text("RGB: " +int(r) + ", " +int(g) + ", " +int(b), width/6, height - 15);

  // if(ws.onopen){
  //   text("Conectado al ESP32", width*1/2.5, height-15);
  // }
  // else{
  //   text("ESP32 NO CONECTADO!!", width*1/2.5, height-15);
  // }

  if (!ws || ws.readyState === WebSocket.CLOSED) {
    text("ESP32 NO CONECTADO!!", width*1/2.5, height-15);
  } else if (ws.readyState === WebSocket.OPEN) {
    text("ESP32 conectado", width*1/2.5, height-15);
  } else {
    text("Conectando...", width*1/2.5, height-15);
  }
  
}

// // =========================
// // SERIAL ESP32
// // =========================

// async function conectarSerial() {

//   if (conectado) return;

//   try {

//     port = await navigator.serial.requestPort();

//     await port.open({
//       baudRate: 115200
//     });

//     conectado = true;

//     reader = port.readable.getReader();

//     leerLoop();

//     console.log("ESP32 conectada");

//   } catch (err) {

//     console.error(err);
//   }
// }

// async function leerLoop() {

//   if (!conectado) return;

//   try {

//     const { value, done } = await reader.read();

//     if (done) {

//       reader.releaseLock();
//       return;
//     }

//     if (value) {

//       let texto = decoder.decode(value).trim();

//       // limpiar caracteres extra
//       let soloNumeros = texto.replace(/[^0-9]/g, "");

//       let num = parseInt(soloNumeros);

//       if (!isNaN(num)) {

//         pot = num;
//       }
//     }

//     // seguir leyendo continuamente
//     leerLoop();

//   } catch (err) {

//     console.error("Error lectura:", err);

//     conectado = false;
//   }
// }