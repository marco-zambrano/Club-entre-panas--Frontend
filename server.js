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

// Función para generar comentarios aleatorios
function generateRandomComment() {
    const comments = [
        "Me encanta este producto! 😍",
        "¿Tienen envíos a mi ciudad?",
        "Necesito más información",
        "¿Cuál es el precio?",
        "Hermoso diseño ❤️",
        "¿Tienen otros colores?",
        "¿Hacen ventas al por mayor?",
        "Excelente calidad",
        "¿Tienen stock disponible?",
        "¿Aceptan tarjetas de crédito?"
    ];
    return comments[Math.floor(Math.random() * comments.length)];
}

// Función para generar títulos de publicación aleatorios
function generateRandomPostTitle() {
    const titles = [
        "Nueva colección de...",
        "Ofertas especiales en...",
        "Últimas tendencias en...",
        "Descuentos exclusivos...",
        "Productos destacados...",
        "Novedades en nuestra...",
        "Promoción especial de...",
        "Lo más vendido en...",
        "Colección limitada de...",
        "Lanzamiento especial..."
    ];
    return titles[Math.floor(Math.random() * titles.length)];
}

// Almacenamiento de contactos y comentarios
const contacts = new Map();
const comments = new Map();
let contactCreationInterval;
let commentCreationInterval;
let messageInterval;

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Enviar los contactos y comentarios existentes al cliente
    socket.emit('initialData', {
        contacts: Array.from(contacts.values()),
        comments: Array.from(comments.values())
    });

    // Crear un nuevo contacto cada 5 segundos
    contactCreationInterval = setInterval(() => {
        const newContact = {
            id: `contact-${Date.now()}`,
            type: 'contact',
            name: generateRandomName(),
            platform: generateRandomPlatform(),
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messages: []
        };
        
        contacts.set(newContact.id, newContact);
        io.emit('newItem', newContact);
    }, 4000);

    // Crear un nuevo comentario cada 8 segundos
    commentCreationInterval = setInterval(() => {
        const newComment = {
            id: `comment-${Date.now()}`,
            type: 'comment',
            name: generateRandomName(),
            platform: generateRandomPlatform(),
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            postTitle: generateRandomPostTitle(),
            messages: []
        };
        
        comments.set(newComment.id, newComment);
        io.emit('newItem', newComment);
    }, 7000);

    // Enviar mensajes o comentarios aleatorios
    messageInterval = setInterval(() => {
        if (contacts.size > 0 || comments.size > 0) {
            // Decidir aleatoriamente si enviar a un contacto o comentario
            const isContact = Math.random() > 0.5;
            const items = isContact ? contacts : comments;
            
            if (items.size > 0) {
                const itemIds = Array.from(items.keys());
                const randomId = itemIds[Math.floor(Math.random() * itemIds.length)];
                const item = items.get(randomId);

                // Crear un nuevo mensaje
                const message = {
                    text: isContact ? generateRandomMessage() : generateRandomComment(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sender: Math.random() > 0.5 ? 'bot' : 'contact'
                };

                // Agregar el mensaje al item
                item.messages.push(message);
                item.lastMessageTime = message.time;

                // Enviar el mensaje a todos los clientes
                io.emit('newMessage', {
                    itemId: randomId,
                    message: message
                });
            }
        }
    }, 2000);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        clearInterval(contactCreationInterval);
        clearInterval(commentCreationInterval);
        clearInterval(messageInterval);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
