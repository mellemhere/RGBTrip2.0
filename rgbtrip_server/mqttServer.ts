import {Client, Packet, Server} from 'mosca';
import {CurrentState, Effect} from './objects';
import {StateController} from './stateController';

const mosca = require('mosca');

export class MqttServer {
    private configuracoesMQTT = {
        port: 1885
    };

    private server: Server;
    private stateController: StateController | undefined;

    constructor() {
        this.server = new mosca.Server(this.configuracoesMQTT, () => {
            console.log('[MQTT] Online');
            this.setupEvents();
        });
    }

    public setStateController(stateController: StateController) {
        this.stateController = stateController;
    }

    private setupEvents() {
        this.server.on('clientConnected', (client: Client) => {
            console.log('Usuario se conectou MQTT');

            if (this.stateController !== undefined) {
                this.stateController.resetState();
            }
        });

        this.server.on('published', (packet: Packet, client: Client) => {
            // console.log('Published', packet.payload.toString());
        });
    }

    public broadcastChange(currentState: CurrentState, changeType: 'LIGHT' | 'POOL' | 'EFFECT') {
        console.log(`Mudanca de estado MQTT evento: ${changeType}`);
        let buffer: Buffer = Buffer.from([]);

        switch (changeType) {
            case 'EFFECT':
                if (currentState.effect !== false) {
                    buffer = Buffer.from([
                        0,
                        (currentState.effect as Effect).id,
                        (currentState.effect as Effect).intensity,
                        (currentState.effect as Effect).velocity
                    ]);
                } else {
                    buffer = Buffer.from([
                        0,
                        255, // u255 == -1 == stop effects
                        0,
                        0,
                    ]);
                }
                break;
            case 'LIGHT':
                buffer = Buffer.from([
                    1,
                    currentState.light.r,
                    currentState.light.g,
                    currentState.light.b,
                ]);
                break;
            case 'POOL':
                buffer = Buffer.from([
                    2,
                    currentState.poolLight
                ]);
                break;
        }

        this.server.publish({
            topic: 'led',
            payload: buffer,
            retain: false,
            qos: changeType === 'LIGHT' ? 0 : 1  // this is important for offline messaging
        }, () => {
            // Fazemos nada com o retorno
        });
    }
}
