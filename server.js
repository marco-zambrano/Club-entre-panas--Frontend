const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const items = require('./mockdata');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));


//RANDOM NAMES
function generateRandomName() {
    const names = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofía', 'David', 'Elena'];
    const surnames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Flores', 'Torres'];
    return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
}

//RANDOM PLATFORMS
function generateRandomPlatform(platform) {
    let platforms = null;
    platforms = platform === 'contact' ? ['facebook', 'instagram', 'whatsapp'] : ['facebook', 'instagram']
    return platforms[Math.floor(Math.random() * platforms.length)];
}

//RANDOM MESSAGES
// function generateRandomMessage() {
//     const messages = [
//         "Hola, ¿cómo estás?",
//         "¿Podrías ayudarme con una consulta?",
//         "Necesito información sobre tus pulseras",
//         "¿Tienes disponibilidad para hablar hoy? 😊",
//         "Me gustaría preguntar por el accesorio...",
//         "¿Cuál es el precio de...?",
//         "Gracias por tu ayuda ❤️",
//         "¿Podrías darme más detalles?",
//         "Perfecto, me parece bien 👌",
//         "¿A qué hora puedo hablarles mañana?"
//     ];
//     return messages[Math.floor(Math.random() * messages.length)];
// }


//FUNC TO GENERATE RANDOM IMAGES
// function generateRandomImage() {
//     const imageUrls = [
//         'https://picsum.photos/300/200',
//         'https://picsum.photos/400/300',
//         'https://picsum.photos/500/400',
//         'https://picsum.photos/600/500',
//         'https://picsum.photos/700/600'
//     ];
//     return imageUrls[Math.floor(Math.random() * imageUrls.length)];
// }

//RANDOM COMMENTS
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
        
// GENERATE A NEW CONTACT
function generateNewContact() {
    const newContact = {
        id: 'a9f3c2d1e0b4',
        name: 'John Smith',
        platform: 'facebook',
        interest: 8,
        botEnabled: true,
        message: {
            id: Math.random().toString(36).substring(2, 15),
            content: 'https://picsum.photos/300/200',
            type: 'image',
            time: Date.now(),
            self: false
        }
    };
    return newContact;
}

//RANDOM COMMENT
function generateNewComment() {
    const newComment = {
        userId: Math.random().toString(36).substring(2, 15),
        postId: Math.random().toString(36).substring(2, 15),
        name: generateRandomName(),
        platform: generateRandomPlatform('comment'),
        botEnabled: Math.random() > 0.5 ? true : false,
        interest: Math.floor(Math.random() * 11),
        permalink: 'https://www.linkfalso.com/sj1n1324nj2n', // new property
        comment: {
            id: Math.random().toString(36).substring(2, 15),
            content: generateRandomComment(),
            type: 'text',
            time: Date.now(),
            self: false
        }
    };
    return newComment;
}







io.on('connection', (socket) => {
    socket.on('getItems', (data) => { // SEND ITEMS
        const fullList = items[data.filter].list;
        const selectItems = items[data.filter].list.slice(data.count, data.count + 12); //slice gets items from that index, UP TO that index
        // Since .length (which is what the frontend uses) returns a number that is 1 higher than the last index, we dont need to add 1 to the count. This works perfectly

        const allItemsLoaded = data.count + 12 >= fullList.length;

        socket.emit('newItems', {
            filter: data.filter,
            items: selectItems,
            allItemsLoaded: allItemsLoaded
        })
    });


    // UPDATE BOT STATUS
    socket.on('botStatus', (data) => {
        const { itemId, status } = data;
        const item = items.contacts.list.find(item => item.id === itemId) || items.comments.list.find(item => `${item.userId}-${item.postId}` === itemId);
        item.botEnabled = status;
    })


    //TO RECEIVE MANUAL MESSAGE
    socket.on('sendManMessage', (data) => {
        const { metaId, content, type } = data;
        console.log(content)
        const item = items.contacts.list.find(item => item.id === metaId) || items.comments.list.find(item => `${item.userId}-${item.postId}` === metaId);

        var randomalphanumericid = Math.random().toString(36).substring(2, 15);

        const entry = { //IN THE REAL BACKEND PROBABLY HAVE TO GET THE MESSAGE ID WITH THE API
            id: randomalphanumericid,
            content: content,
            time: Date.now(),
            type: type,
            self: true
        }
        var entryKey = (data.filter == "contacts") ? "messages" : (data.filter == "comments") ? "comments" : null;
        item[entryKey].push(entry);
    });


    //SEND ITEM History
    socket.on('getItemHistory', (data) => {
        const itemSearched = items[data.filter].list.find( item => item.id === data.itemId) || items.comments.list.find(item => `${item.userId}-${item.userId}` === data.itemId);
        let entries = (data.filter == "contacts") ? "messages" : (data.filter == "comments") ? "comments" : null;

        socket.emit('itemContentHistory', itemSearched[entries]); 
    })


    //QUICK REPLIES
    let replies = [
        'El producto en promocion es tal tal',
        'Hola, muy buenas tardes, sea bienvenido a Club Entre Panas, estamos aca para servirle',
        'Hola, que tal, actualmente no nos encontramos atendiendo en nuestro local'
    ];

    socket.on('getQuickReps', () => {
        socket.emit('quickReps', replies); 
    });
    socket.on('updateQuickReps', (newQrs) => {
        replies = newQrs;
    });



    // BOT CONFIG PROMPT
    let botData = {
        prompt: "Hola, soy el bot de Club Entre Panas, ¿en qué puedo ayudarte?",
        dataTable: `{
            "nombre": "Bot de Club Entre Panas",
            "version": "1.0",
            "config": {
                "respuestas_rapidas": ["info", "soporte", "eventos"],
                "activo": true,
                "modo_privado": false
            },
            "comandos": {
                "/start": "Inicia la conversación",
                "/help": "Muestra ayuda",
                "/eventos": "Próximos eventos del club"
            },
            "metadata": {
                "creador": "Equipo Club Entre Panas",
                "fecha_creacion": "2025-06-18"
            }
        }`,
        tokenUsage: 10
    };

    socket.on('updatePrompt', (prompt, dataTable) => {
        botData.prompt = prompt;
        botData.dataTable = dataTable;
    });
    socket.on("getCustomPrompt", async () => {
        setTimeout(() => {
            socket.emit('customPrompt', botData);
        }
        , 2000); // Simulate a delay of 2 seconds
    });



    //TIME TESTING
    //NEW MESSAGES EVERY 15 SECS
    // const contactInterval = setInterval(() => {
    //     var newContact = generateNewContact();
    
    //     io.emit('newMessage', newContact);

    //     //THIS IS JUST TO SAVE IT ON THE SERVER SIDE AND KEEP CONSISTENCY AND REDUNDANCY
    //     newContact.messages = [];
    //     newContact.messages.push({
    //         id: newContact.message.id, 
    //         type: newContact.message.type, 
    //         content: newContact.message.content, 
    //         time: newContact.message.time, 
    //         self: newContact.message.self
    //     });
    //     delete newContact.message; // Remove the message property from the contact object
    //     items.contacts.list.unshift(newContact); // Add it at the beginning of the list

    //     console.log("New contact generated")
    // }, 7000);

    // NEW COMMENTS EVERY 15 SECS
    // const commentInterval = setInterval(() => {
    //     const newComment = generateNewComment();

    //     io.emit('newMessage', newComment);


    //     //SET THE COMMENTS ARRAY TO THE NEW COMMENT
    //     newComment.comments = [];
    //     newComment.comments.push({
    //         userId: newComment.comment.userId,
    //         postId: newComment.comment.postId,
    //         type: newComment.comment.type,
    //         content: newComment.comment.content,
    //         permalink: newComment.comment.permalink, // new property
    //         time: newComment.comment.time,
    //         self: newComment.comment.self
    //     });
    //     delete newComment.comment; // Remove the comment property from the comment object
    //     items.comments.list.unshift(newComment); // Add it at the beginning of the list
    //     console.log("New comment generated")
    // }, 15000);


    // setInterval(() => {
    //     const comment = {
    //         userId: "9e2b0a1c3f7d",
    //         postId: "392rh392rn39",
    //         name: "Isabel Ríos",
    //         platform: "instagram",
    //         botEnabled: true,
    //         interest: 5,
    //         comment: {
    //             id: "9e2b0a1c3f7d",
    //             content: generateRandomComment(),
    //             type: 'text',
    //             time: Date.now(),
    //             self: true
    //         }
    //     }
    //     io.emit('newMessage', comment);
    // }
    // , 25000); // Send a random comment every 25 seconds

    // setInterval(() => {
    //     const message = {
    //         id: "d3b0f1a6e9c2",
    //         name: "Emilio Narváez",
    //         platform: "faceboko",
    //         botEnabled: false,
    //         interest: 5,
    //         message: {
    //             id: "9e2b0a1c3f7d",
    //             content: generateRandomComment(),
    //             type: 'text',
    //             time: Date.now(),
    //             self: (Math.random() > 0.5 ? true : false)
    //         }
    //     }
    //     io.emit('newMessage', message);
    // }
    // , 5000); // Send a random message every 20 seconds

    //ON DISCONONECT
    socket.on('disconnect', () => {
        // clearInterval(contactInterval);
        // clearInterval(commentInterval);
        console.log('Cliente desconectado:', socket.id);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
