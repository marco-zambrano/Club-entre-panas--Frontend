import { socket, initSocket } from './socket.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize socket connection and message handling
    initSocket((data) => {
        console.log("Mensaje recibido:", data);
        // Aquí puedes agregar la lógica para mostrar el mensaje en la interfaz
    });

});