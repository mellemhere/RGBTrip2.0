import {CurrentState, LightColors} from './objects';
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
    effect: false, // effects[Math.floor(Math.random() * Math.floor(5))],
    light: stringToRGB('white'),
    poolLight: stringToRGB('white'),
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

function broadcastState() {
    ws.emit('state', currentState);
}

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

    socket.on('rgb_churras', (dados: LightColors) => {
        currentState.light = dados;
        broadcastStateBut(socket);
    });

    socket.on('rgb_pool', (dados: LightColors) => {
        currentState.poolLight = dados;
        broadcastStateBut(socket);
    });

    socket.on('effect_start', (effectId: number) => {
        console.log('[WS] Iniciando efeito! ID: ' + effectId);
        currentState.effect = effects.filter((value) => {
            return value.id === effectId;
        })[0];
        broadcastState();
    });

    socket.on('effect_stop', () => {
        console.log('[WS] Parando efeito!');
        currentState.effect = false;
        broadcastState();
    });

    socket.on('effect_prop_intensity', (valor) => {
        console.log('[WS] Mudando intensidade do evento: ' + valor.val);
        if (currentState.effect !== false) {
            currentState.effect.intensity = valor.val;
        } else {
            console.log('[WS] Erro! Tentaram mudar um evento e nao estamos em um');
        }
        broadcastStateBut(socket);
    });

    socket.on('effect_prop_velocity', (valor) => {
        console.log('[WS] Mudando velocidade do evento: ' + valor.val);
        if (currentState.effect !== false) {
            currentState.effect.velocity = valor.val;
        } else {
            console.log('[WS] Erro! Tentaram mudar um evento e nao estamos em um');
        }
        broadcastStateBut(socket);
    });

    socket.on('sync', (state: boolean) => {
        currentState.sync = state;
        broadcastStateBut(socket);
    });

    socket.on('pool_power', (state: boolean) => {
        console.log('Pool power');
    });

});

// let b = false;
//
// setInterval(() => {
//     if (b) {
//         console.log('Comecando efeito');
//         currentState.effect = effects[Math.floor(Math.random() * Math.floor(5))];
//         b = false;
//     } else {
//         console.log('Parando efeito');
//         currentState.effect = effects[Math.floor(Math.random() * Math.floor(5))];
//         b = true;
//     }
//
//     broadcastState();
// }, 5000);
