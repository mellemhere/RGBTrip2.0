import {CurrentState} from './objects';
import {stringToRGB} from './util';
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
    effect: null,
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
    socket.emit('state', currentState);

    socket.on('disconnect', () => {
        console.log('[WS] Um usuario saiu');
    });

    socket.on('rgb_change', (dados) => {
        currentState.light = dados;
        broadcastStateBut(socket);
    });

    socket.on('sync', (state: boolean) => {
        currentState.sync = state;
        broadcastStateBut(socket);
    });
});

