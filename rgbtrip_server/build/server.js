"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var mosca = require('mosca');
/*
    CONFIGURACOES
 */
var configuracoesWS = {
    http: {
        port: 3000,
        bundle: true,
        static: './'
    }
};
var configuracoesMQTT = {
    port: 1885
};
var currentState = {
    effect: null,
    light: util_1.stringToRGB('white'),
    sync: false
};
var serverWS = new mosca.Server(configuracoesWS, function () {
    console.log('Servidor WS: Online');
});
var serverMQTT = new mosca.Server(configuracoesMQTT, function () {
    console.log('Servidor MQTT: Online');
});
function broadcastCurrentState() {
    console.log('[MQTTWS] Transmitindo status');
    serverWS.publish({
        topic: 'state',
        payload: Buffer.from(JSON.stringify(currentState)),
        retain: false
    });
}
serverWS.on('clientConnected', function (client) {
    console.log('[MQTTWS] Cliente conectado: ', client.id);
    broadcastCurrentState();
});
// fired when a message is received
serverWS.on('published', function (packet) {
    console.log('Published', packet.payload);
});
