import {Injectable} from '@angular/core';
import {connect} from 'mqtt';

interface MqttMessage {
    topic: string;
    message: any;
}

@Injectable({
    providedIn: 'root'
})
export class MqttControllerService {


    private mqttClient;
    private disconnectedFired = false;
    private disconnectCallback: () => void = () => {
    };
    private connectedCallback: () => void = () => {
    };

    constructor() {
        this.mqttClient = connect('mqtt://localhost:3000');
        this.setupEvents();
    }

    public onDisconnect(cb: () => void) {
        this.disconnectCallback = cb;
    }

    public onConnected(cb: () => void) {
        this.connectedCallback = cb;
    }

    private fireDisconnect() {
        if (!this.disconnectedFired) {
            this.disconnectCallback();
            this.disconnectedFired = true;
        }
    }

    private setupEvents() {
        this.mqttClient.on('connect', (e) => {
            console.log('[MQTT] Conectado');
            this.connectedCallback();
            this.disconnectedFired = false;
            this.mqttClient.subscribe('state', (err) => {
            });
        });

        this.mqttClient.on('disconnect', (e) => {
            console.log('[MQTT] Desconectado');
            this.fireDisconnect();
        });

        this.mqttClient.on('reconnect', (e) => {
            console.log('[MQTT] Reconectando');
            this.fireDisconnect();
        });

        this.mqttClient.on('error', (e) => {
            this.fireDisconnect();
        });

        this.mqttClient.on('message', (topic, message, packet) => {
            console.log(topic);
            console.log(JSON.parse(message.toString()));
        });
    }

    public isConnectd() {
        return this.mqttClient.connected;
    }

    public sendMessage(message: MqttMessage) {
        if (this.isConnectd()) {
            this.mqttClient.publish(message.topic, message.message);
        }
    }
}
