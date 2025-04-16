export const socket = io();

// Inicializa la escucha de mensajes y ejecuta la función de callback cuando llega uno nuevo
export function initSocket(receiveMessageCallback) {
    socket.on('newMessage', (data) => {
        receiveMessageCallback(data);
    });
}

// Función para enviar mensajes a través de Socket.IO
export function sendSocketMessage(data) {
    socket.emit('sendMessage', data);
}