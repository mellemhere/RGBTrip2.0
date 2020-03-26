import {CurrentState} from './objects';
import {stringToRGB} from './util';
import {Client, Packet} from 'mosca';

const mosca = require('mosca');

/*
    CONFIGURACOES
 */
const configuracoesWS = {
    http: {
        port: 3000,
        bundle: true,
        static: './'
    }
};
const configuracoesMQTT = {
    port: 1885
};

const currentState = {
    effect: null,
    light: stringToRGB('white'),
    sync: false
} as CurrentState;


const serverWS = new mosca.Server(configuracoesWS, () => {
    console.log('[MQTTWS] Online');
});

const serverMQTT = new mosca.Server(configuracoesMQTT, () => {
    console.log('[MQTT] Online');
});


function broadcastCurrentState() {
    console.log('[MQTTWS] Transmitindo status');
    serverWS.publish({
        topic: 'state',
        payload: Buffer.from(JSON.stringify(currentState)),
        retain: false
    });
}


serverWS.on('clientConnected', (client: Client) => {
    console.log('[MQTTWS] Cliente conectado: ', client.id);
});

// fired when a message is received
serverWS.on('published', (packet: Packet) => {
    console.log('Published', packet.payload);
});

serverWS.on('subscribed', (e: string) => {
    console.log('[MQTTWS] Transmitindo dados para novo clinete');
    broadcastCurrentState();
});

