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

export interface UpdatePackage {
    topic: string;
    state: CurrentState;
}

export interface Effect {
    id: number;
    name: string;
    canChangeIntensity: boolean;
    canChangeVelocity: boolean;
    intensity: number;
    velocity: number;
}
