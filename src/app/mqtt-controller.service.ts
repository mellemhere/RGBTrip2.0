import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';

export interface Effect {
    id: number;
    name: string;
    speed: number;
    intensity: number;
}

export interface LightColors {
    r: number;
    g: number;
    b: number;
}

export interface CurrentState {
    light: LightColors;
    effect: Effect | null;
    sync: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MqttControllerService {


    private mqttClient;
    private $connection: Observable<boolean>;
    private $state: Observable<CurrentState>;

    constructor(private socket: Socket) {
        this.socket.connect();
        this.setupEvents();
    }

    private setupEvents() {
        this.$connection = new Observable<boolean>(subscriber => {
            this.socket.on('connect', () => {
                console.log('[WS] Conectado ao ws');
                subscriber.next(true);
            });

            this.socket.on('connect_error', () => {
                console.log('[WS] Morreu :( connect_error');
                subscriber.next(false);
            });

            this.socket.on('connect_timeout', () => {
                console.log('[WS] Morreu :( connect_timeout');
                subscriber.next(false);
            });

            this.socket.on('error', () => {
                console.log('[WS] Morreu :( error');
                subscriber.next(false);
            });

            this.socket.on('disconnect', () => {
                console.log('[WS] Morreu :( disconnect');
                subscriber.next(false);
            });
        });

        this.$state = this.socket.fromEvent<CurrentState>('state');
    }


    get connection(): Observable<boolean> {
        return this.$connection;
    }

    get state(): Observable<CurrentState> {
        return this.$state;
    }

    public sendMessage(topic: string, data: any) {
        this.socket.emit(topic, data);
    }
}
