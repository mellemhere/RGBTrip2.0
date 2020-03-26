"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colorString = require('color-string');
function stringToRGB(color) {
    var colorObj = colorString.get.rgb(color);
    return {
        r: colorObj[0],
        g: colorObj[1],
        b: colorObj[2]
    };
}
exports.stringToRGB = stringToRGB;
