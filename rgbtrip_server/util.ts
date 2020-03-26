import {LightColors} from './objects';

const colorString = require('color-string');

export function stringToRGB(color: string) {
    const colorObj = colorString.get.rgb(color);
    return {
        r: colorObj[0],
        g: colorObj[1],
        b: colorObj[2]
    } as LightColors;
}
