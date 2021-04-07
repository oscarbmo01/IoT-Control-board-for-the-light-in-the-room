# Emulador de NodeMCU
# Uso de mqtt

import paho.mqtt.client as mqtt
import json
import random


def on_connect(client, userdata, flags, rc):
    print("Conexion al broker exitosa " + str(rc))
    client.subscribe("nodemcu")
    actualizarDatos()

def on_message(client, userdata, msg):
    print("mensaje: " + str(msg.payload))
    datos = json.loads(msg.payload)
    estadoPin(client, datos)

def estadoPin(client, datos):
    funcion = datos["funcion"]

    if funcion == "read":
        return client.publish("dashboard", json.dumps(listaPin))

    if funcion == "write":
        pin = datos["pin"]
        if datos["estadoNuevo"]:
            estadoNuevo = datos["estadoNuevo"]
        else:
            estadoNuevo = "LOW" if listaPin[pin]["estadoActual"] == "HIGH" else "HIGH"
        listaPin[pin]["estadoActual"] = estadoNuevo
        return client.publish("dashboard", json.dumps(listaPin))


def actualizarDatos():
    listaPin["D0"]["estadoActual"] = "HIGH"
    listaPin["D1"]["estadoActual"] = "LOW"
    listaPin["D2"]["estadoActual"] = "LOW"
    listaPin["D3"]["estadoActual"] = "HIGH"
    client.publish("dashboard", json.dumps(listaPin))


listaPin = {
    "D0": {"estadoActual": ""},
    "D1": {"estadoActual": ""},
    "D2": {"estadoActual": ""},
    "D3": {"estadoActual": ""},
}

# Conexion al broker mqtt
# Configuracion por defecto al broker libre mqtt https://www.emqx.io/mqtt/public-mqtt5-broker
# Puede usar un broker mqtt de forma local

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("broker.emqx.io", 1883, 60)
client.loop_forever()
