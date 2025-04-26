const express = require('express');
const { stat } = require('fs');
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
function generateRandomPlatform(platform) {
    let platforms = null;
    platforms = platform === 'contact' ? ['facebook', 'instagram', 'whatsapp'] : ['facebook', 'instagram']
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

// Función para generar URLs de imágenes aleatorias
function generateRandomImage() {
    const imageUrls = [
        'https://picsum.photos/300/200',
        'https://picsum.photos/400/300',
        'https://picsum.photos/500/400',
        'https://picsum.photos/600/500',
        'https://picsum.photos/700/600'
    ];
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

// Almacenamiento de contactos y comentarios
const contacts = new Map();
const comments = new Map();
const ITEMS_PER_PAGE = 20;

// Generar datos iniciales
function generateInitialData() {
    // Generar 50 contactos
    for (let i = 0; i < 50; i++) {
        const contact = {
            id: `contact-${i}`,
            type: 'contact',
            name: generateRandomName(),
            platform: generateRandomPlatform('contact'),
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            preview: generateRandomPostTitle(),
            messages: [],
            isBotActived: Math.random() > 0.5 ? true : false
        };
        contacts.set(contact.id, contact);
    }

    // Generar 50 comentarios
    for (let i = 0; i < 50; i++) {
        const comment = {
            id: `comment-${i}`,
            type: 'comment',
            name: generateRandomName(),
            platform: generateRandomPlatform('comment'),
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            postTitle: generateRandomPostTitle(),
            messages: [],
            isBotActived: Math.random() > 0.5 ? true : false
        };
        comments.set(comment.id, comment);
    }
}

generateInitialData();

// Función para generar un nuevo contacto
function generateNewContact() {
    const newContact = {
        id: `contact-${Date.now()}`,
        type: 'contact',
        name: generateRandomName(),
        platform: generateRandomPlatform('contact'),
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        preview: generateRandomPostTitle(),
        messages: [],
        isBotActived: Math.random() > 0.5 ? true : false
    };
    contacts.set(newContact.id, newContact);
    return newContact;
}

// Función para generar un nuevo comentario
function generateNewComment() {
    const newComment = {
        id: `comment-${Date.now()}`,
        type: 'comment',
        name: generateRandomName(),
        platform: generateRandomPlatform('comment'),
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        postTitle: generateRandomPostTitle(),
        messages: [],
        isBotActived: Math.random() > 0.5 ? true : false
    };
    comments.set(newComment.id, newComment);
    return newComment;
}

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Manejar la carga inicial de items
    socket.on('requestInitialItems', (data) => {
        const items = data.type === 'contact' ? contacts : comments;
        const itemsArray = Array.from(items.values());
        const paginatedItems = itemsArray.slice(0, ITEMS_PER_PAGE);
        
        socket.emit('initialData', {
            items: paginatedItems
        });
    });

    // Manejar la carga de más items
    socket.on('requestMoreItems', (data) => {
        const items = data.type === 'contact' ? contacts : comments;
        const itemsArray = Array.from(items.values());
        const startIndex = data.page * ITEMS_PER_PAGE;
        const paginatedItems = itemsArray.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        
        socket.emit('loadMoreItems', {
            items: paginatedItems,
            page: data.page
        });
    });

    // Para recibir el estado del bot
    socket.on('botToggle', (data) => {
        const { itemId, status } = data;
        console.log('id: ', itemId);
        console.log('status: ', status);
        const itemType = itemId.startsWith('contact') ? contacts : comments;
        const item = itemType.get(itemId);
        if (item) {
            item.isBotActived = status;
        }
    })
    // Para recibir el texto que es enviado manualmente
    socket.on('sendMessage', (data) => {
        console.log(data.text);
    })

    // Generar nuevos contactos cada 10 segundos
    const contactInterval = setInterval(() => {
        const newContact = generateNewContact();
        io.emit('newItem', newContact);
    }, 5000);

    // Generar nuevos comentarios cada 15 segundos
    const commentInterval = setInterval(() => {
        const newComment = generateNewComment();
        io.emit('newItem', newComment);
    }, 7000);

    // Enviar mensajes o comentarios aleatorios cada 2 segundos
    const messageInterval = setInterval(() => {
        if (contacts.size > 0 || comments.size > 0) {
            // Decidir aleatoriamente si enviar a un comentario o mensaje
            const sender = Math.random() > 0.5 ? 'bot' : 'contact';
            const isContact = Math.random() > 0.5;
            const items = isContact ? contacts : comments;
            
            if (items.size > 0) {
                const itemIds = Array.from(items.keys());
                const randomId = itemIds[Math.floor(Math.random() * itemIds.length)];
                const item = items.get(randomId);

                // Decidir aleatoriamente si enviar un mensaje de texto o una imagen
                const isImage = Math.random() > 0.7; // 30% de probabilidad de ser imagen

                // Crear un nuevo mensaje
                const message = {
                    text: isImage ? '' : (isContact ? generateRandomMessage() : generateRandomComment()),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sender: sender,
                    type: isImage ? 'image' : ((Math.random() > 0.5 && isContact && sender === 'contact') ? 'audio' : ''),
                    imageUrl: isImage ? generateRandomImage() : null
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
        clearInterval(contactInterval);
        clearInterval(commentInterval);
        clearInterval(messageInterval);
        console.log('Cliente desconectado:', socket.id);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
