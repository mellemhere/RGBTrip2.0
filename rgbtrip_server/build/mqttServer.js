"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mosca = require('mosca');
var MqttServer = /** @class */ (function () {
    function MqttServer() {
        var _this = this;
        this.configuracoesMQTT = {
            port: 1885
        };
        this.server = new mosca.Server(this.configuracoesMQTT, function () {
            console.log('[MQTT] Online');
            _this.setupEvents();
        });
    }
    MqttServer.prototype.setStateController = function (stateController) {
        this.stateController = stateController;
    };
    MqttServer.prototype.setupEvents = function () {
        var _this = this;
        this.server.on('clientConnected', function (client) {
            console.log('Usuario se conectou MQTT');
            if (_this.stateController !== undefined) {
                _this.stateController.resetState();
            }
        });
        this.server.on('published', function (packet, client) {
            // console.log('Published', packet.payload.toString());
        });
    };
    MqttServer.prototype.broadcastChange = function (currentState, changeType) {
        console.log("Mudanca de estado MQTT evento: " + changeType);
        var buffer = Buffer.from([]);
        switch (changeType) {
            case 'EFFECT':
                if (currentState.effect !== false) {
                    buffer = Buffer.from([
                        0,
                        currentState.effect.id,
                        currentState.effect.intensity,
                        currentState.effect.velocity
                    ]);
                }
                else {
                    buffer = Buffer.from([
                        0,
                        255,
                        0,
                        0,
                    ]);
                }
                break;
            case 'LIGHT':
                buffer = Buffer.from([
                    1,
                    currentState.light.r,
                    currentState.light.g,
                    currentState.light.b,
                ]);
                break;
            case 'POOL':
                buffer = Buffer.from([
                    2,
                    currentState.poolLight
                ]);
                break;
        }
        this.server.publish({
            topic: 'led',
            payload: buffer,
            retain: false,
            qos: changeType === 'LIGHT' ? 0 : 1 // this is important for offline messaging
        }, function () {
            // Fazemos nada com o retorno
        });
    };
    return MqttServer;
}());
exports.MqttServer = MqttServer;
