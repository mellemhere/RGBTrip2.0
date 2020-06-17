import {CurrentState} from './objects';
import {stringToRGB} from './util';
import {MqttServer} from './mqttServer';
import {effects} from './effects';
import {Socket} from 'socket.io';


export class StateController {

    private currentState: CurrentState;

    constructor(public mqttServer: MqttServer, public ws: any) {
        this.currentState = {
            effect: false,
            light: stringToRGB('white'),
            poolLight: stringToRGB('white'),
            sync: false,
            debug: 0
        } as CurrentState;
    }


    public getCurrentState() {
        return this.currentState;
    }

    public startEffect(effectID: number) {
        this.currentState.effect = effects.filter((value) => {
            return value.id === effectID;
        })[0];

        this.mqttServer.broadcastChange(this.currentState, 'EFFECT');
        this.broadcast();
    }

    public stopEffect() {
        this.currentState.effect = false;
        this.mqttServer.broadcastChange(this.currentState, 'EFFECT');
        this.broadcast();
    }

    public changeEffectProp(propType: 'INT' | 'VEL', val: number) {
        if (this.currentState.effect !== false) {
            if (propType === 'INT') {
                this.currentState.effect.intensity = val;
            } else if (propType === 'VEL') {
                this.currentState.effect.velocity = val;
            }
        } else {
            console.log('[WS] Erro! Tentaram mudar um evento e nao estamos em um');
        }
    }

    public setPoolLightSync(status: boolean) {
        this.currentState.sync = status;
    }

    public setRGBColor(r: number, g: number, b: number, normalLight: boolean) {

        if (this.currentState.effect !== false) {
            /*
            Erro de sync
             */
            this.stopEffect();
            this.ws.emit('data_state', this.getCurrentState());
        }

        if (normalLight) {
            this.currentState.light.r = r;
            this.currentState.light.g = g;
            this.currentState.light.b = b;
            this.mqttServer.broadcastChange(this.currentState, 'LIGHT');
        } else {
            this.currentState.poolLight.r = r;
            this.currentState.poolLight.g = g;
            this.currentState.poolLight.b = b;
            this.mqttServer.broadcastChange(this.currentState, 'POOL');
        }
    }

    public resetState() {
        /*
         Quando o stm conecta vamos resetar os status
         */
        this.currentState = {
            effect: false,
            light: stringToRGB('white'),
            poolLight: stringToRGB('white'),
            sync: false,
            debug: 0
        } as CurrentState;
        this.ws.emit('data_state', this.getCurrentState());
    }

    public broadcast() {
        console.log('[WS] Enviando mudanca de status para APP - Todos');
        console.log(this.getCurrentState());
        this.ws.emit('data_state', this.getCurrentState());
    }

    public emit(socket: Socket) {
        console.log('[WS] Enviando mudanca de status para APP - Somente um user');
        socket.broadcast.emit('data_state', this.getCurrentState());
    }

}
