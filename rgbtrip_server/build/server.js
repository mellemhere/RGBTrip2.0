"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("./effects");
var mqttServer_1 = require("./mqttServer");
var stateController_1 = require("./stateController");
var express = require('express');
var app = express();
var httpServer = require('http').createServer(app);
var ws = require('socket.io')(httpServer);
var fs = require('fs');
var mqttServer = new mqttServer_1.MqttServer();
var currentStateController = new stateController_1.StateController(mqttServer, ws);
mqttServer.setStateController(currentStateController);
/*
    CONFIGURACOES
 */
var configuracoesHTTP = {
    port: 80
};
httpServer.listen(configuracoesHTTP.port, function () {
    console.log('[WS] Online');
});
if (fs.existsSync(__dirname + '/../www')) {
    console.log('Servindo diretorio: ' + __dirname + '/../www');
    app.use(express.static(__dirname + '/../www'));
}
else {
    console.log('Servindo diretorio: ' + __dirname + '/../../www');
    app.use(express.static(__dirname + '/../../www'));
}
app.get('/tabs/*', function (req, res) {
    res.status(301).redirect('/');
});
ws.on('connection', function (socket) {
    console.log('[WS] Novo usuario conectado');
    socket.emit('welcome_package', {
        state: currentStateController.getCurrentState(),
        effects: effects_1.effects
    });
    socket.on('disconnect', function () {
        console.log('[WS] Um usuario saiu');
    });
    socket.on('rgb_churras', function (dados) {
        currentStateController.setRGBColor(dados.r, dados.g, dados.b, true);
        currentStateController.emit(socket);
    });
    socket.on('rgb_pool', function (dados) {
        currentStateController.setRGBColor(dados.r, dados.g, dados.b, false);
        currentStateController.emit(socket);
    });
    socket.on('effect_start', function (effectId) {
        console.log('[WS] Iniciando efeito! ID: ' + effectId);
        currentStateController.startEffect(effectId);
    });
    socket.on('effect_stop', function () {
        console.log('[WS] Parando efeito!');
        currentStateController.stopEffect();
    });
    socket.on('effect_prop_intensity', function (valor) {
        console.log('[WS] Mudando intensidade do evento: ' + valor.val);
        currentStateController.changeEffectProp('INT', valor.val);
        currentStateController.emit(socket);
    });
    socket.on('effect_prop_velocity', function (valor) {
        console.log('[WS] Mudando velocidade do evento: ' + valor.val);
        currentStateController.changeEffectProp('VEL', valor.val);
        currentStateController.emit(socket);
    });
    socket.on('sync', function (state) {
        currentStateController.setPoolLightSync(state);
        currentStateController.emit(socket);
    });
    socket.on('pool_power', function (state) {
        console.log('Pool power');
    });
});
