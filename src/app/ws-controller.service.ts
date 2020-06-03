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
    poolLight: LightColors;
    effect: Effect | false;
    sync: boolean;
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

    constructor(private socket: Socket) {
        this.socket.connect();
        this.setupEvents();
    }

    private setupEvents() {
        /*
            Eventos de conexão... para mostrar o loading de conectando...
        */
        this.$connection = new Observable<boolean>(subscriber => {
            // subscriber.next(false);

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
            this.socket.on('state', (currentState: CurrentState) => {
                console.log('Akii!');
                console.log(currentState.effect);
                console.log(this.currentEffect);
                if (currentState.effect !== false) {
                    /*
                        Recebemos um efeito! Ja estamos nele sera?
                     */
                    if (this.currentEffect === false) {
                        // Novo efeito!
                        this.currentEffect = currentState.effect;
                        this.effectSubscribers.next(this.currentEffect);
                    } else {
                        // Ja estamos em efeito = )
                        this.currentEffect = currentState.effect;
                    }
                } else {
                    // Sepa temos que desligar o efeito
                    if (this.currentEffect !== false) {
                        this.currentEffect = false;
                        this.effectSubscribers.next(false);
                    }
                }

                stateSubscribers.next(currentState);
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

    public sendMessage(topic: string, data: any) {
        this.socket.emit(topic, data);
    }
}
