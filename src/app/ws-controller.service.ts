import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable, Subscriber} from 'rxjs';


export interface LightColors {
    r: number;
    g: number;
    b: number;
}

export interface CurrentState {
    light: LightColors;
    poolLight: LightColors;
    effect: Effect | false;
    sync: boolean;
    debug: number;
}

export interface Effect {
    id: number;
    name: string;
    canChangeIntensity: boolean;
    canChangeVelocity: boolean;
    intensity: number; /* -50% -> +50% */
    velocity: number;  /* -50% -> +50% */
    sonorous: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class WsControllerService {

    private $connection: Observable<boolean>;
    private $state: Observable<CurrentState>;
    private $effectChange: Observable<Effect | false>;

    private stateSubscribers: Subscriber<CurrentState>;
    private effectSubscribers: Subscriber<Effect | false>;
    public availableEffects: Effect[] = [];
    public currentEffect: Effect | false = false;

    private isConnected = false;
    private lastStateSent = 0;

    constructor(private socket: Socket) {
        this.socket.connect();
        this.setupEvents();
    }

    private connectionSender(subscriber: Subscriber<any>, value: any) {
        if (((new Date().getTime()) - this.lastStateSent) > 10) {
            subscriber.next(value);
            this.lastStateSent = new Date().getTime();
        } else {
            setTimeout(() => {
                this.connectionSender(subscriber, value);
            }, 15);
        }
    }

    private setupEvents() {
        /*
            Eventos de conexão... para mostrar o loading de conectando...
        */
        this.$connection = new Observable<boolean>(subscriber => {
            this.connectionSender(subscriber, false);
            this.isConnected = false;

            this.socket.on('connect', () => {
                console.log('[WS] Conectado ao ws');
                this.connectionSender(subscriber, true);
                this.isConnected = true;
            });

            this.socket.on('connect_error', () => {
                console.log('[WS] Morreu :( connect_error');
                this.connectionSender(subscriber, false);
                this.isConnected = false;
            });

            this.socket.on('connect_timeout', () => {
                console.log('[WS] Morreu :( connect_timeout');
                this.connectionSender(subscriber, false);
                this.isConnected = false;
            });

            this.socket.on('error', () => {
                console.log('[WS] Morreu :( error');
                this.connectionSender(subscriber, false);
                this.isConnected = false;
            });

            this.socket.on('disconnect', () => {
                console.log('[WS] Morreu :( disconnect');
                this.connectionSender(subscriber, false);
                this.isConnected = false;
            });
        });
        this.$connection.subscribe(); // fuck lazy loading

        /*
             Evento de mudanca de efeito
        */
        this.$effectChange = new Observable<Effect | false>((subscriber) => {
            this.effectSubscribers = subscriber;
        });

        /*
            Evento estado | Cor rgb.. botoes.. eventos
        */
        this.$state = new Observable<CurrentState>(stateSubscribers => {
            this.stateSubscribers = stateSubscribers;
        });
        this.$state.subscribe(); // fuck lazy loading

        this.socket.on('data_state', (currentState: CurrentState) => {
            console.log('Novo pacote de dados:');
            console.log(currentState);
            if (currentState.effect !== false) {
                /*
                    Recebemos um efeito! Ja estamos nele sera?
                 */
                if (this.currentEffect === false) {
                    // Novo efeito!
                    console.log('Devemos executar um efeito:' + currentState.effect.name);
                    this.currentEffect = currentState.effect;
                    this.effectSubscribers.next(this.currentEffect);
                } else {
                    // Ja estamos em efeito = )
                    console.log('Ja estava no efeito');
                    this.currentEffect = currentState.effect;
                }
            } else {
                // Sepa temos que desligar o efeito
                if (this.currentEffect !== false) {
                    this.currentEffect = false;
                    this.effectSubscribers.next(false);
                }
            }

            this.stateSubscribers.next(currentState);
        });

        /*
            Evento quando abrimos o APP... sincroniza
         */
        this.socket.on('welcome_package', (welcomePackage) => {
            console.log('Sincronizado!');
            console.log(welcomePackage);

            if (this.stateSubscribers !== undefined) {
                this.stateSubscribers.next(welcomePackage.state);
            }

            if (welcomePackage.state.effect === false && this.currentEffect !== false) {
                this.effectSubscribers.next(false);
            }

            this.currentEffect = welcomePackage.state.effect;
            this.availableEffects = welcomePackage.effects;

            if (this.currentEffect !== false) {
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

    get connected(): boolean {
        return this.isConnected;
    }


    public sendMessage(topic: string, data: any) {
        this.socket.emit(topic, data);
    }
}
