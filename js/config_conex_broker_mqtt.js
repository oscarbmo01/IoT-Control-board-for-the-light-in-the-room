/* 
    Conexion al broker mqtt
    Configuracion por defecto al broker libre mqtt https://www.emqx.io/mqtt/public-mqtt5-broker
    Puede usar un broker mqtt de forma local configurado para uso de Websocket Port.
*/

// Configuracion de funciones a ejecutar por los eventos mqtt
// Se modifica el DOM dependiendo del estado del emulador nodemcu escrito en python "emunodemcu.py"
var clientId = new Date();
client = new Paho.MQTT.Client("broker.emqx.io", Number(8083), clientId.toString());

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({ onSuccess: onConnect });

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    estadoActualLuzHabitacion = JSON.parse(message.payloadString);
    actualizarVistaWeb(estadoActualLuzHabitacion);
}

function onConnect() {
    client.subscribe("dashboard");
    leerEstadoLuzHabitacion();
    console.log("onConnect");
}


// Actualizar el DOM para vizualizar el estado actual de las habitaciones
function actualizarVistaWeb(estadoActualLuzHabitacion) {
    for (let clave in estadoActualLuzHabitacion) {
        let botonModificarLuz = document.getElementById(`boton-pin${clave}`);
        let imgHabitacion = document.getElementById(`img-pin${clave}`);
  
        if (estadoActualLuzHabitacion[clave]["estadoActual"] == "HIGH") {
  
            botonModificarLuz.value = "Apagar";
            botonModificarLuz.style.backgroundColor = "rgb(243, 134, 45)";
            imgHabitacion.style.opacity = 0.9;
  
        } else {
  
            botonModificarLuz.value = "Encender";
            botonModificarLuz.style.backgroundColor = "rgb(245, 242, 81)";
            imgHabitacion.style.opacity = 0.3;
  
        }
    }
}