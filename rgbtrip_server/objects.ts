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
