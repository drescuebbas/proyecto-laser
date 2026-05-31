let ws;
let valorPot = 0;

function setup() {
    createCanvas(600, 700);
    background(20);
    colorLinea = color(60, 100, 120); // color inicial

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
}

function draw() {

    // if (!ws || ws.readyState !== WebSocket.OPEN) {
    // fill(255);
    // textAlign(CENTER);
    // text("Conectando...", width/2, height/2);
    // return;
    // }
//------------------------------------------------
  //elipseClaude();
  valorPote();
  dibujo();
  //cambiarColor();
  borrarFondo();
}

// FUNCIONES

function valorPote(){
    fill(0);
    rectMode(CENTER);
    rect(2, 30, 30);
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text("Potenciómetro: " + valorPot, width / 2, 30);

}

function elipseClaude(){
    // Mapear 0-4095 (ADC 12 bits) a lo que necesites
    let diametro = map(valorPot, 0, 4095, 20, 350);
    fill(100, 200, 255);
    noStroke();
    ellipse(width / 2, height / 2, diametro, diametro);
}

function dibujo(){
    if (mouseIsPressed) {
        stroke(colorLinea); 
        strokeWeight(10);
        line(pmouseX, pmouseY, mouseX, mouseY);
    }
}

function borrarFondo() { 
    if (key === 'r') {
        background(20);
    }
}

function cambiarColor(){
    if (key === 'c' || key === 'C') {
        colorLinea = color(random(255), random(50), random(255)); // color aleatorio
    }
}