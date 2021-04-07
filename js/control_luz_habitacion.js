// Control de luz usando la interfaz web

// Declaracion de variables y  elements button a utilizar
var estadoActualLuzHabitacion = {
  "D0": { "estadoActual": null },
  "D1": { "estadoActual": null },
  "D2": { "estadoActual": null },
  "D3": { "estadoActual": null }
};

var botonPinD0 = document.getElementById("boton-pinD0");
var botonPinD1 = document.getElementById("boton-pinD1");
var botonPinD2 = document.getElementById("boton-pinD2");
var botonPinD3 = document.getElementById("boton-pinD3");

botonPinD0.addEventListener("click", function () { actualizarEstadoLuzHabitacion("D0") });
botonPinD1.addEventListener("click", function () { actualizarEstadoLuzHabitacion("D1") });
botonPinD2.addEventListener("click", function () { actualizarEstadoLuzHabitacion("D2") });
botonPinD3.addEventListener("click", function () { actualizarEstadoLuzHabitacion("D3") });

// Enviar mensaje al topic con mqtt
function mqttPubMensaje(topic, datosJson) {
  message = new Paho.MQTT.Message(JSON.stringify(datosJson));
  message.destinationName = topic;
  client.send(message);
}

// Comunicacion por mqtt para leer el estado del emulador nodemcu "emunodemcu.py"
function leerEstadoLuzHabitacion() {
  let datos = {
    "funcion": "read",
  }
  mqttPubMensaje("nodemcu", datos)
}


// Comunicacion por maqtt para modificar el estado del emulador nodemcu "emunodemcu.py"
function actualizarEstadoLuzHabitacion(pin) {
  let datos = {
    "funcion": "write",
    "pin": pin,
    "estadoNuevo": null
  }
  mqttPubMensaje("nodemcu", datos);
  sintesisVoz(pin)
}

