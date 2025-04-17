export const socket = io();

// Inicializa la conexión socket
export function initSocket() {
    console.log('Socket initialized');
}

// Función para enviar mensajes a través de Socket.IO
export function sendSocketMessage(data) {
    socket.emit('sendMessage', data);
}