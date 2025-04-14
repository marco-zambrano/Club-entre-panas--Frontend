const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Envía un mensaje simulado cada 5 segundos para pruebas
    const intervalId = setInterval(() => {
        const data = {
            contactName: "Contacto de Prueba",
            messageText: "Mensaje simulado desde el backend",
            messageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: Math.random() > 0.5 ? "bot" : "contact"
        };
        socket.emit('newMessage', data);
    }, 2500);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        clearInterval(intervalId);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
