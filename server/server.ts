const mosca = require("mosca");

/*
    CONFIGURACOES
 */
const configuracoes_ws = {
    http: {
        port: 3000,
        bundle: true,
        static: './'
    }
};
const configuracoes_mqtt = {
    port: 1885
};


const server_ws = new mosca.Server(configuracoes_ws, () => {
    console.log("Servidor WS: Online");
});

const server_mqtt = new mosca.Server(configuracoes_mqtt, () => {
    console.log("Servidor MQTT: Online");
});


server_ws.on('clientConnected', function (client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server_ws.on('published', function (packet, client) {
    console.log('Published', packet.payload);
});
