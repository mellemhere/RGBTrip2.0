import {Effect} from './objects';

export const effects = [
    {
        id: 0, // Faz nao aparecer na lista de efeitos
        name: 'Aleatorio',
        canChangeVelocity: true,
        canChangeIntensity: true,
    },
    {
        id: 1,
        name: 'Clube Carvalho',
        canChangeVelocity: true,
        canChangeIntensity: true,
    },
    {
        id: 2,
        name: 'Strobo',
        canChangeVelocity: true,
        canChangeIntensity: true,
    },
    {
        id: 3,
        name: 'Strobo colorido',
        canChangeVelocity: true,
        canChangeIntensity: true,
    },
    {
        id: 4,
        name: 'Balada',
        canChangeVelocity: true,
        canChangeIntensity: true,
    },
    {
        id: 5,
        name: 'YMCA',
        canChangeVelocity: true,
        canChangeIntensity: true,
    },
    {
        id: 6,
        name: 'Camale\u00E3o',
        canChangeVelocity: true,
        canChangeIntensity: false,
    }
] as Effect[];
