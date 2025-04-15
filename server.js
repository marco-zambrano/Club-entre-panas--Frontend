const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Función para generar nombres aleatorios
function generateRandomName() {
    const names = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofía', 'David', 'Elena'];
    const surnames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Flores', 'Torres'];
    return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
}

// Función para generar plataformas aleatorias
function generateRandomPlatform() {
    const platforms = ['facebook', 'instagram', 'whatsapp'];
    return platforms[Math.floor(Math.random() * platforms.length)];
}

// Función para generar mensajes aleatorios
function generateRandomMessage() {
    const messages = [
        "Hola, ¿cómo estás?",
        "¿Podrías ayudarme con una consulta?",
        "Necesito información sobre tus pulseras",
        "¿Tienes disponibilidad para hablar hoy? 😊",
        "Me gustaría preguntar por el accesorio...",
        "¿Cuál es el precio de...?",
        "Gracias por tu ayuda ❤️",
        "¿Podrías darme más detalles?",
        "Perfecto, me parece bien 👌",
        "¿A qué hora puedo hablarles mañana?"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Almacenamiento de contactos y sus mensajes
const contacts = new Map();
let contactCreationInterval;
let messageInterval;

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Enviar los contactos existentes al cliente
    socket.emit('initialContacts', Array.from(contacts.values()));

    // Crear un nuevo contacto cada 10 segundos
    contactCreationInterval = setInterval(() => {
        const newContact = {
            id: `contact-${Date.now()}`,
            name: generateRandomName(),
            platform: generateRandomPlatform(),
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messages: []
        };
        
        contacts.set(newContact.id, newContact);
        io.emit('newContact', newContact);
    }, 7000);

    // Enviar mensajes aleatorios cada 5 segundos
    messageInterval = setInterval(() => {
        if (contacts.size > 0) {
            // Seleccionar un contacto aleatorio
            const contactIds = Array.from(contacts.keys());
            const randomContactId = contactIds[Math.floor(Math.random() * contactIds.length)];
            const contact = contacts.get(randomContactId);

            // Crear un nuevo mensaje
            const message = {
                text: generateRandomMessage(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: Math.random() > 0.5 ? 'bot' : 'contact'
            };

            // Agregar el mensaje al contacto
            contact.messages.push(message);
            contact.lastMessageTime = message.time;

            // Enviar el mensaje a todos los clientes
            io.emit('newMessage', {
                contactId: randomContactId,
                message: message
            });
        }
    }, 2000);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        clearInterval(contactCreationInterval);
        clearInterval(messageInterval);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
