import {CurrentState} from './objects';
import {stringToRGB} from './util';
import {effects} from './effects';
import {Socket} from 'socket.io';

const mosca = require('mosca');
const app = require('express')();
const httpServer = require('http').createServer(app);
const ws = require('socket.io')(httpServer);


/*
    CONFIGURACOES
 */
const configuracoesHTTP = {
    port: 80
};

const configuracoesMQTT = {
    port: 1885
};

const currentState = {
    effect: effects[Math.floor(Math.random() * Math.floor(5))],
    light: stringToRGB('white'),
    sync: false
} as CurrentState;


httpServer.listen(configuracoesHTTP.port, () => {
    console.log('[WS] Online');
});

const serverMQTT = new mosca.Server(configuracoesMQTT, () => {
    console.log('[MQTT] Online');
});

serverMQTT.on('clientConnected', (client) => {
    console.log('Usuario se conectou MQTT');
});

serverMQTT.on('published', (packet, client) => {
    console.log('Published', packet.payload.toString());
});

function broadcastStateBut(socket: Socket) {
    console.log('[WS] Enviando mudanca de status');
    socket.broadcast.emit('state', currentState);
}

ws.on('connection', (socket: Socket) => {
    console.log('[WS] Novo usuario conectado');
    socket.emit('welcome_package', {
        state: currentState,
        effects
    });

    socket.on('disconnect', () => {
        console.log('[WS] Um usuario saiu');
    });

    socket.on('rgb_churras', (dados) => {
        currentState.light = dados;
        broadcastStateBut(socket);
    });

    socket.on('rgb_pool', (dados) => {
        console.log('Color pool ', dados);
        // currentState.light = dados;
        // broadcastStateBut(socket);
    });

    socket.on('sync', (state: boolean) => {
        currentState.sync = state;
        broadcastStateBut(socket);
    });

    socket.on('pool_power', (state: boolean) => {
        console.log('Pool power');
    });

});


let b = false;

setInterval(() => {
    if (b) {
        console.log('Comecando efeito');
        ws.emit('effect_start', effects[Math.floor(Math.random() * Math.floor(5))]);
        b = false;
    } else {
        console.log('Parando efeito');
        ws.emit('effect_end', false);
        b = true;
    }
}, 5000);
