import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable, Subscriber} from 'rxjs';


export interface Effect {
    id: number;
    name: string;
    canChangeIntensity: boolean;
    canChangeVelocity: boolean;
    intensity: number;
    velocity: number;
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

    private $connection: Observable<boolean>;
    private $state: Observable<CurrentState>;
    private $effectChange: Observable<Effect | false>;

    private stateSubscribers: Subscriber<CurrentState>;
    private effectSubscribers: Subscriber<Effect | false>;
    public availableEffects: Effect[] = [];
    private currentEffect: Effect | false;

    constructor(private socket: Socket) {
        this.socket.connect();
        this.setupEvents();
    }

    private setupEvents() {
        /*
            Eventos de conexão... para mostrar o loading de conectando...
        */
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

        /*
            Evento estado | Cor rgb.. botoes.. eventos
        */
        this.$state = new Observable<CurrentState>(stateSubscribers => {
            this.stateSubscribers = stateSubscribers;
            this.socket.on('state', (currentState: CurrentState) => {
                this.currentEffect = currentState.effect;
                stateSubscribers.next(currentState);
            });
        });

        /*
             Evento de mudanca de efeito
        */
        this.$effectChange = new Observable<Effect | false>((subscriber) => {
            this.effectSubscribers = subscriber;
            this.socket.on('effect_start', (effect: Effect) => {
                console.log('Comecando evento');
                subscriber.next(effect);
            });

            this.socket.on('effect_end', (effect: Effect) => {
                console.log('Parando evento!');
                subscriber.next(false);
            });
        });

        /*
            Evento quando abrimos o APP... sincroniza
         */
        this.socket.on('welcome_package', (welcomePackage) => {
            if (this.stateSubscribers !== undefined) {
                this.stateSubscribers.next(welcomePackage.state);
            }

            this.currentEffect = welcomePackage.state.effect;
            this.availableEffects = welcomePackage.effects;

            if (this.currentEffect !== false) {
                console.log('Currently in effect');
                this.effectSubscribers.next(this.currentEffect);
            }
        });


    }


    get connection(): Observable<boolean> {
        return this.$connection;
    }

    get state(): Observable<CurrentState> {
        return this.$state;
    }

    get effectChange(): Observable<Effect | false> {
        return this.$effectChange;
    }


    get getCurrentEffect(): Effect | false {
        return this.currentEffect;
    }

    public sendMessage(topic: string, data: any) {
        this.socket.emit(topic, data);
    }
}
