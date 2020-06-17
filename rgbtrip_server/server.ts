import {LightColors} from './objects';
import {effects} from './effects';
import {Socket} from 'socket.io';
import {MqttServer} from './mqttServer';
import {StateController} from './stateController';

const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const ws = require('socket.io')(httpServer);
const fs = require('fs');

const mqttServer = new MqttServer();
const currentStateController = new StateController(mqttServer, ws);
mqttServer.setStateController(currentStateController);

/*
    CONFIGURACOES
 */
const configuracoesHTTP = {
    port: 80
};


httpServer.listen(configuracoesHTTP.port, () => {
    console.log('[WS] Online');
});

if (fs.existsSync(__dirname + '/../www')) {
    console.log('Servindo diretorio: ' + __dirname + '/../www');
    app.use(express.static(__dirname + '/../www'));
} else {
    console.log('Servindo diretorio: ' + __dirname + '/../../www');
    app.use(express.static(__dirname + '/../../www'));
}

app.get('/tabs/*', (req: any, res: any) => {
    res.status(301).redirect('/');
});


ws.on('connection', (socket: Socket) => {
    console.log('[WS] Novo usuario conectado');
    socket.emit('welcome_package', {
        state: currentStateController.getCurrentState(),
        effects
    });

    socket.on('disconnect', () => {
        console.log('[WS] Um usuario saiu');
    });

    socket.on('rgb_churras', (dados: LightColors) => {
        currentStateController.setRGBColor(dados.r, dados.g, dados.b, true);
        currentStateController.emit(socket);
    });

    socket.on('rgb_pool', (dados: LightColors) => {
        currentStateController.setRGBColor(dados.r, dados.g, dados.b, false);
        currentStateController.emit(socket);
    });

    socket.on('effect_start', (effectId: number) => {
        console.log('[WS] Iniciando efeito! ID: ' + effectId);
        currentStateController.startEffect(effectId);
    });

    socket.on('effect_stop', () => {
        console.log('[WS] Parando efeito!');
        currentStateController.stopEffect();
    });

    socket.on('effect_prop_intensity', (valor) => {
        console.log('[WS] Mudando intensidade do evento: ' + valor.val);
        currentStateController.changeEffectProp('INT', valor.val);
        currentStateController.emit(socket);
    });

    socket.on('effect_prop_velocity', (valor) => {
        console.log('[WS] Mudando velocidade do evento: ' + valor.val);
        currentStateController.changeEffectProp('VEL', valor.val);
        currentStateController.emit(socket);
    });

    socket.on('sync', (state: boolean) => {
        currentStateController.setPoolLightSync(state);
        currentStateController.emit(socket);
    });

    socket.on('pool_power', (state: boolean) => {
        console.log('Pool power');
    });

});

