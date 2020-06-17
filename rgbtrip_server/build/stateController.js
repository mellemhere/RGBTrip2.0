"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var effects_1 = require("./effects");
var StateController = /** @class */ (function () {
    function StateController(mqttServer, ws) {
        this.mqttServer = mqttServer;
        this.ws = ws;
        this.currentState = {
            effect: false,
            light: util_1.stringToRGB('white'),
            poolLight: util_1.stringToRGB('white'),
            sync: false,
            debug: 0
        };
    }
    StateController.prototype.getCurrentState = function () {
        return this.currentState;
    };
    StateController.prototype.startEffect = function (effectID) {
        this.currentState.effect = effects_1.effects.filter(function (value) {
            return value.id === effectID;
        })[0];
        this.mqttServer.broadcastChange(this.currentState, 'EFFECT');
        this.broadcast();
    };
    StateController.prototype.stopEffect = function () {
        this.currentState.effect = false;
        this.mqttServer.broadcastChange(this.currentState, 'EFFECT');
        this.broadcast();
    };
    StateController.prototype.changeEffectProp = function (propType, val) {
        if (this.currentState.effect !== false) {
            if (propType === 'INT') {
                this.currentState.effect.intensity = val;
            }
            else if (propType === 'VEL') {
                this.currentState.effect.velocity = val;
            }
        }
        else {
            console.log('[WS] Erro! Tentaram mudar um evento e nao estamos em um');
        }
    };
    StateController.prototype.setPoolLightSync = function (status) {
        this.currentState.sync = status;
    };
    StateController.prototype.setRGBColor = function (r, g, b, normalLight) {
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
        }
        else {
            this.currentState.poolLight.r = r;
            this.currentState.poolLight.g = g;
            this.currentState.poolLight.b = b;
            this.mqttServer.broadcastChange(this.currentState, 'POOL');
        }
    };
    StateController.prototype.resetState = function () {
        /*
         Quando o stm conecta vamos resetar os status
         */
        this.currentState = {
            effect: false,
            light: util_1.stringToRGB('white'),
            poolLight: util_1.stringToRGB('white'),
            sync: false,
            debug: 0
        };
        this.ws.emit('data_state', this.getCurrentState());
    };
    StateController.prototype.broadcast = function () {
        console.log('[WS] Enviando mudanca de status para APP - Todos');
        console.log(this.getCurrentState());
        this.ws.emit('data_state', this.getCurrentState());
    };
    StateController.prototype.emit = function (socket) {
        console.log('[WS] Enviando mudanca de status para APP - Somente um user');
        socket.broadcast.emit('data_state', this.getCurrentState());
    };
    return StateController;
}());
exports.StateController = StateController;
