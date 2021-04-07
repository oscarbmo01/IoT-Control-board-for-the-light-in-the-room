// Programacion funcional que utiliza la API Web Speech


// Validar soporte del navegador para uso de la API
// Modificar el DOM dependiendo del soporte para la API
// Configuracion de la API si es que es soportada
const navSoportReconozimientoVoz = 'webkitSpeechRecognition' in window && "speechSynthesis" in window;

if (navSoportReconozimientoVoz) {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "es-MX";
  recognition.onresult = function(event) { listComandosControlVoz(event) }
  recognition.onerror = function(event) { console.log("ocurrio un error", event.error) }

  var botonMicrofono = document.getElementById("boton-microfono");
  botonMicrofono.onclick = function () { recognition.start() };
  
} else {
  document.getElementById("boton-microfono").style.display = "none";
  document.getElementsByClassName("div-comandos")[0].style.display = "none";
}

// Lista de comandos a utilizar por el usuario para el control por voz
function listComandosControlVoz(event) {
  let comandoVoz = {
    "habitación 1 encender luz": { "pin": "D0", "estadoNuevo": "HIGH" },
    "habitación 1 apagar luz": { "pin": "D0", "estadoNuevo": "LOW" },
    "habitación 2 encender luz": { "pin": "D1", "estadoNuevo": "HIGH" },
    "habitación 2 apagar luz": { "pin": "D1", "estadoNuevo": "LOW" },
    "habitación 3 encender luz": { "pin": "D2", "estadoNuevo": "HIGH" },
    "habitación 3 apagar luz": { "pin": "D2", "estadoNuevo": "LOW" },
    "habitación 4 encender luz": { "pin": "D3", "estadoNuevo": "HIGH" },
    "habitación 4 apagar luz": { "pin": "D3", "estadoNuevo": "LOW" }
  }
  let comando = event.results[0][0].transcript;
  if (comandoVoz[comando.toLowerCase()]) {
    actualizarEstadoLuzHabitacionVoz(comandoVoz[comando.toLowerCase()]);
  } else {
    console.log("Comando de voz no reconocido: ", comando);
  }
}

// Actualizar el estado del emulador nodemcu escrito en python "emunodemcu.py"
// Comunicacion remota usando MQTT
function actualizarEstadoLuzHabitacionVoz(comandoVoz) {
  let pin = comandoVoz["pin"];
  let estadoNuevo = comandoVoz["estadoNuevo"];
  let datos = {
    "funcion": "write",
    "pin": pin,
    "estadoNuevo": estadoNuevo
  }
  sintesisVoz(pin);
  mqttPubMensaje("nodemcu", datos);
}

// Confirmacion por voz del estado nuevo de la luz en la habitacion
function sintesisVoz(pin) {
  comando = (estadoActualLuzHabitacion[pin]["estadoActual"] == "HIGH") ? "Apagada" : "Encendida";
  let msg = new SpeechSynthesisUtterance(comando);
  msg.lang = "es-MX";
  speechSynthesis.speak(msg);
}