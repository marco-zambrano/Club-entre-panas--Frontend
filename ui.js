import { currentItemId, currentFilter } from "./script.js"; // Variables
import { openItem, setCurrentFilter, filterItems, initilizeBotToggle } from "./script.js"; // Functions
import { sendManMessage, items, quickReps, getQuickReps, updateQuickReps, sendBotConf, getCustomPrompt, botPrompts, tokenUsage } from './socket.js';

export function createMessage(content, time, sender, type) {
    // create new message
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    // Se agrega el mensaje basado en el remitente usando su propiedad definida del css
    messageElement.classList.add(`${sender}-sender`)

    // Contenido del mensaje
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    

    // Si es una imagen, crear el elemento img
    if (type === 'image') {
        messageElement.classList.add(`image`); // Definimos que el mensaje va a ser un img
        const imageElement = document.createElement('img');
        imageElement.src = content;
        imageElement.alt = 'Imagen enviada';
        imageElement.className = 'message-image';
        messageContent.appendChild(imageElement);
    } else if(type === "text"){
        // Si es texto normal, solo ponemos el texto
        messageContent.textContent = content;
    } else if (type === 'audio') {
        const audioAdvice = document.createElement('span');
        audioAdvice.className = 'message-audio';
        audioAdvice.textContent = 'audio.. 🔉';
        messageElement.appendChild(audioAdvice);
        messageContent.textContent = content;
    }

    // Span de tiempo
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = time;
    
    // Añadir mensaje al chat
    messageContent.appendChild(timeSpan);
    messageElement.appendChild(messageContent);
    // Agregar al main container

    
    //SET TIME INVERVAL OF 1 SECOND
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.appendChild(messageElement);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


// Funciones para crear los items de comentarios y contactos
function createContactCard(contact) {
    // Container del contacto
    const contactElement = document.createElement('div');
    contactElement.className = `contact ${contact.id === currentItemId ? 'active' : ''}`; //WHAT THIS DOES IS THAT IF THE CONTACT ID IS THE SAME AS THE CURRENT ITEM ID, IT WILL ADD THE CLASS ACTIVE
    contactElement.dataset.platform = contact.platform;
    contactElement.dataset.itemId = contact.id;
    contactElement.dataset.type = contact.type;

    // contact image notificationAdd commentMore actions
    const imageMessageExits = contact.messages.find(message => message.type === 'image' && message.self === false); // Verifica si hay un mensaje de imagen que no es del usuario actual

    if (imageMessageExits && !contact.imageVisualized) {
        //  SI ya existe el elemento de notificación de imagen, e imageVisualized es false, mostrar la notificación
        const currentImageNotification = document.getElementById(`image-notification-${contact.id}`);
        if (currentImageNotification) {
            currentImageNotification.style.display = 'block';
            return;
        }

        // Si no existe, creamos el elemento de notificación de imagen
        const imageNotificationElement = document.createElement('div');
        imageNotificationElement.className = 'image-notification';
        imageNotificationElement.id = `image-notification-${contact.id}`;
        imageNotificationElement.textContent = '🖼️';
        contactElement.appendChild(imageNotificationElement);

        // Añadimos la propiedad imageVisualized, diciendo que es false (recien creado)
        items[currentFilter].list.forEach(item => {
            if (item.id === contact.id) {
                item.imageVisualized = false;
            }
        });
    }

    
    // Preview
    const preView = document.createElement('span');
    preView.className = 'contact-preview';
    preView.textContent = contact.messages[contact.messages.length - 1].content; // Ultimo mensaje
    
    // Span del tiempo del ultimo mensaje
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    const fecha = new Date(contact.messages[contact.messages.length -1].time);
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'p.m.' : 'a.m.';
    const horas12 = horas % 12 || 12;
    messageTime.textContent = `${horas12}:${minutos} ${ampm}`;

    // Container de la info del contacto
    const contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info';

    // Nombre del contacto
    const contactName = document.createElement('span');
    contactName.className = 'contact-name';
    contactName.textContent = contact.name;

    // container for platform info and interest level 
    const contactSide = document.createElement('div');
    contactSide.className = 'contact-side';

    // Nivel de interes
    const interest = document.createElement('span');
    interest.className = 'contact-interest';
    interest.textContent = contact.interest;

    const interestNumber = Number(contact.interest);
    if (interestNumber >= 0 && interestNumber <= 4) {
        interest.style.color = '#FF2929';
    } else if (interestNumber >= 5 && interestNumber <= 7) {
        interest.style.color = '#FFD943';
    } else {
        interest.style.color = '#14F000';
    }

    // Container de la plataforma
    const platform = document.createElement('div');
    platform.className = 'platform';
    
    // Span de la plataforma
    const platformName = document.createElement('span');
    platformName.textContent = contact.platform.charAt(0).toUpperCase() + contact.platform.slice(1);
    
    // Icono de la plataforma
    const platformIcon = document.createElement('i');
    platformIcon.className = `fab fa-${contact.platform} ${contact.platform}-icon`;


    // Platform Container <--- nombre e icono
    platform.appendChild(platformName);
    platform.appendChild(platformIcon);

    // contact side <----- platform and interest
    contactSide.appendChild(platform);
    contactSide.appendChild(interest);

    // Contact info <--- nombre, plataforma, hora de ultimo mensaje
    contactInfo.appendChild(contactName);
    // contactInfo.appendChild(platform);
    contactInfo.appendChild(messageTime);

    // Contact element <--- El preview, interest y la informacion del contacto
    contactElement.appendChild(preView);
    contactElement.appendChild(contactInfo);
    contactElement.appendChild(contactSide);
    // contactElement.appendChild(interest);

    return contactElement; // Retornamos el contacto
}

function createCommentCard(comment) {
    // Container del comentario
    const commentElement = document.createElement('div');
    commentElement.className = `contact ${comment.id === currentItemId ? 'active' : ''}`;
    commentElement.dataset.platform = comment.platform;
    commentElement.dataset.itemId = comment.id;
    commentElement.dataset.type = comment.type;

    
    // Container del info del comentario (la clase dice contact-info porque son los mismos estilos)
    const commentInfo = document.createElement('div');
    commentInfo.className = 'contact-info';
    commentInfo.classList.add('comment');
    
    // Preview
    const preView = document.createElement('span');
    preView.className = 'contact-preview';
    preView.textContent = comment.comments[comment.comments.length - 1].content; // Ultimo mensaje
    
    // Header container
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';
    
    // Logo con la C, para definir que es un comentario
    const typeIdentifier = document.createElement('span');
    typeIdentifier.className = 'type-identifier';
    typeIdentifier.textContent = 'C';

    // Nombre del user del comentario
    const commentName = document.createElement('span');
    commentName.className = 'contact-name';
    commentName.textContent = comment.name;

    // comments details container
    const commentDetails = document.createElement('div');
    commentDetails.classList.add('comment-details')
    
    // // preview del titulo del post 
    // const postTitle = document.createElement('span');
    // postTitle.className = 'post-title';
    // postTitle.textContent = comment.postTitle;

    // Platform container
    const platform = document.createElement('div');
    platform.className = 'platform';
    
    // Nombre de la plataforma de la que viene el comment
    const platformName = document.createElement('span');
    platformName.textContent = comment.platform.charAt(0).toUpperCase() + comment.platform.slice(1);
    
    // Logo de la plataforma
    const platformIcon = document.createElement('i');
    platformIcon.className = `fab fa-${comment.platform} ${comment.platform}-icon`;
    
    // Nivel de interes
    const interest = document.createElement('span');
    interest.className = 'contact-interest';
    interest.textContent = comment.interest;

    const interestNumber = Number(comment.interest);
    if (interestNumber >= 0 && interestNumber <= 4) {
        interest.style.color = '#FF2929';
    } else if (interestNumber >= 5 && interestNumber <= 7) {
        interest.style.color = '#FFD943';
    } else {
        interest.style.color = '#14F000';
    }

    // Tiempo del ultimo mensaje enviado
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    const fecha = new Date(comment.comments[comment.comments.length -1].time);
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'p.m.' : 'a.m.';
    const horas12 = horas % 12 || 12;
    messageTime.textContent = `${horas12}:${minutos} ${ampm}`;

    // commentHeader <--- logo de C y nonbre del user
    commentHeader.appendChild(typeIdentifier);
    commentHeader.appendChild(commentName);

    // platform container <--- nombre de la plataforma e icono
    platform.appendChild(platformName);
    platform.appendChild(platformIcon);

    // Detalles <--- preview del post, plataforma, tiempo del ultimo mensaje enviado
    // commentDetails.appendChild(postTitle);
    commentDetails.appendChild(platform);
    commentDetails.appendChild(interest);
    commentDetails.appendChild(messageTime);
    
    // Informacion del comentario <--- header, detalles, info (todos contenedores)
    commentInfo.appendChild(preView);
    commentInfo.appendChild(commentHeader);
    commentInfo.appendChild(commentDetails)
    commentElement.appendChild(commentInfo);

    return commentElement; // Retornamos el comment
}


// Actualizar la lista de items
export function updateItemsList(items, currentFilter) {
    if (!items) return;
    const itemsList = document.querySelector('.contacts-list');
    itemsList.innerHTML = ''; // limpiamos

    // Create contact or comment card defined by the currentFilter
    if (currentFilter === 'contacts') {
        items.forEach(item => {
            const itemElement = createContactCard(item); // Creamos contacto
            itemsList.appendChild(itemElement);
        })
    } else {
        items.forEach(item => {
            const itemElement = createCommentCard(item); // Creamos comentario
            itemsList.appendChild(itemElement);
        })
    }

    // Verifica si hay items activos
    const currentItem = items.find(item => item.id === currentItemId);
    // Si no hay items visibles, mostrar mensaje
    if (!currentItem && items.length === 0){
        document.querySelector('.chat-title').textContent = 'Selecciona un contacto o comentario';
        document.querySelector('.messages').innerHTML = '';
        document.querySelector('.bot-toggle').style.display = 'none';
        openItem(null);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // event listener for the contact or comment list
    document.querySelector('.contacts-list').addEventListener('click', (event) => {
        const clicked = event.target.closest('.contact');
        if (!clicked) return;

        // Remover la clase active del elemento que la tenía previamente
        const previouslyActive = document.querySelector('.contact.active');
        if (previouslyActive) previouslyActive.classList.remove('active');

        // Activar el elemento clicked, ya sea comentario o contacto
        clicked.classList.add('active');
        openItem(clicked.dataset.itemId);
        
        // Actualizar el título del chat con el nombre del contacto/comentario
        const contactName = clicked.querySelector('.contact-name').textContent;
        document.querySelector('.chat-title').textContent = contactName;

        //actualizar el bot toggle
        initilizeBotToggle();
    });


    // functionality show / hide contacts in mobile
    document.querySelector('.toggle-contacts').addEventListener('click', function() {
        document.querySelector('.contacts-list').classList.toggle('show');
    });


    // Handle the platform filters
    document.querySelectorAll('.platform-toggle').forEach(toggle => {
        toggle.addEventListener('change', filterItems);
    });
    

    // Manejar el filtro de tipo (chat / comentario)
    const chatButton = document.querySelector('.item-chat');
    const commentButton = document.querySelector('.item-comment');
    const whatsAppToggle = document.getElementById('whatsapp-toggle');
    const linkTag = document.querySelector('.post-link');

    // Función para actualizar el estado de los botones
    function updateFilterButtons() {
        chatButton.classList.toggle('active', currentFilter === 'contacts');
        commentButton.classList.toggle('active', currentFilter === 'comments');
    }

    updateFilterButtons();
    // Event listeners para los botones de filtro
    chatButton.addEventListener('click', () => {
        if (currentFilter !== 'contacts') {
            setCurrentFilter('contacts');
            whatsAppToggle.classList.toggle('active');
            linkTag.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });
    commentButton.addEventListener('click', () => {
        if (currentFilter !== 'comments') {
            // console.log('llegamos')
            setCurrentFilter('comments');
            whatsAppToggle.classList.toggle('active');
            linkTag.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });

    // Send message functionality
    function sendMessage(messageText) {
        if (!messageText) return
        // Obtener hora actual
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        //BUT FIRST WE NEED TO GET HOURS AND MINUTES
        
        const recipientPlatform = items[currentFilter].list.find(item => item.id === currentItemId).platform;

        // send message to the backend
        sendManMessage(currentItemId, "text", messageText, currentFilter, recipientPlatform); // (senderId (Meta), type, content, platform)
        
        // create the message
        createMessage(messageText, timeString, 'bot', 'text');
        
        const entry = {
            content: messageText,
            time: Date.now(),
            type: "text",
            self: true
        }
        var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
        items[currentFilter].list.find(item => item.id === currentItemId)[entryKey].push(entry);
        
        // Scroll al final de los mensajes
        const messagesContainer = document.querySelector('.messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        filterItems();
    }

    const handeInputMessage = () => {
        const input = document.querySelector('.message-input');
        const messageValue = input.value.trim();
        sendMessage(messageValue);
        input.value = '';
    }

    document.querySelector('.send-button').addEventListener('click', () => {
        handeInputMessage();
    });
    
    document.querySelector('.message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handeInputMessage();
        }
    });

    // --- MODALES Y BOTONES ---
    // Modal Principal
    const $ = (se)=> document.querySelector(se)
    const botConfigButton = $('.bot-config-button');   // Boton de configuracion
    const mainConfigModal = $('#mainConfigModal'); // Modal principal
    const closeMainConfig = $('#closeMainConfig'); // Cerrar modal principal
    const openBotConfig = $('#openBotConfig'); // btn abrir bot modal
    const openQuickRepliesConfig = $('#openQuickRepliesConfig'); // btn abrir qr modal
    // Bot Modal
    const botConfigModal = $('.bot-config-modal'); // Modal de configuracion del bot
    const closeModalButton = $('.close-modal'); // Cerrar modal del bot
    const cancelModalButtton = $('.cancel-button'); // Btn cancelar modificacion del bot
    const saveChangesBtn = $('.save-button'); // btn to save and update bot configuration
    const botTextArea = Array.from(document.querySelectorAll('.bot-textarea')); // Text areas values
    // QRs
    const quickRepliesModal = $('#quickRepliesModal'); // QR modal
    const closeQuickReplies = $('#closeQuickReplies'); // Cerrar QR modal 
    const openCreateQuickReply = $('#openCreateQuickReply'); // Abrir modal crear nueva reply
    // Modal crear nueva reply
    const createQuickReplyModal = $('#createQuickReplyModal'); // Modal de crear nueva QR
    const cancelCreateQuickReply = $('#cancelCreateQuickReply'); // Cancelar nueva QR
    const createReplyBtn = $('.save-create-quick-reply') // Crear nueva QR
    const quickRepliesContainer = $('.quick-replies-list');    // Quick reply items containers
    const newQrTextArea = $('.quick-reply-textarea');

    // --- FUNCIONALIDAD DE MODALES ---

    // MODAL GENERAL
    function GeneralModalConfiguration() {
        // Abrir modal principal de configuración
        botConfigButton.addEventListener('click', () => {
            mainConfigModal.classList.add('show');
        });
        // Cerrar modal principal
        closeMainConfig.addEventListener('click', () => {
            mainConfigModal.classList.remove('show');
        });
        mainConfigModal.addEventListener('click', (e) => {
            if (e.target === mainConfigModal) {
                mainConfigModal.classList.remove('show');
            }
        });
        // Escape para cerrar modal principal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainConfigModal.classList.contains('show')) {
                mainConfigModal.classList.remove('show');
            }
        });
    }

    // MODAL DEL BOT
    function botModalConfiguration() {
        // Abrir modal de configuración del bot
        openBotConfig.addEventListener('click', async () => {
            mainConfigModal.classList.remove('show');
            botTextArea[0].value = 'Cargando...'; // cleaning the bot text area value
            botTextArea[1].value = 'Cargando...'; // cleaning the bot text area value
            botConfigModal.classList.add('show');
            await getCustomPrompt(); // Get the bot configuration
            botTextArea[0].value = botPrompts.prompt; // Set the bot configuration to the text area
            botTextArea[1].value = botPrompts.dataTable; // Set the bot configuration to the text area
            const tokenUsageLabel = document.querySelector('.token-usage p');
            if (tokenUsageLabel) {
                tokenUsageLabel.textContent = `Uso total de tokens: ${tokenUsage}`;
            }
        });
        // Cerrar modal de configuración del bot
        closeModalButton.addEventListener('click', () => {
            botConfigModal.classList.remove('show');
        });
        cancelModalButtton.addEventListener('click', () => {
            botConfigModal.classList.remove('show');
        });
        botConfigModal.addEventListener('click', (e) => {
            if (e.target === botConfigModal) {
                botConfigModal.classList.remove('show');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && botConfigModal.classList.contains('show')) {
                botConfigModal.classList.remove('show');
            }
        });
        // update bot configuration
        saveChangesBtn.addEventListener('click', () => {
            const botPrompt = botTextArea[0].value.trim();
            const dataTable = botTextArea[1].value.trim();

            if (botPrompt && dataTable) {
                // Validacion de si dataTable es JSON o no
                try {
                    JSON.parse(dataTable);
                } catch (e) {
                    alert('Texto formato JSON inválido, por favor ingreselo nuevamente')
                    console.error('dataTable, no es un JSON valido');
                    return;
                }
                // enviamos la info del bot
                sendBotConf(botPrompt, dataTable);
                // Ocultamos el modal
                botConfigModal.classList.remove('show');
                console.log('sent to back: ', botTextArea[0].value.trim(), botTextArea[1].value.trim())
            } else {
                alert('No enviar contenido vacío, inténtelo nuevamente');
            }
        })
    }
    

    // ----- QR FUNCTIONS -----
    function createQuickReply(text) {
        // Creamos el nuevo reply
        const newReply = document.createElement('div');
        newReply.classList.add('quick-reply-item');

        const replyText = document.createElement('p');
        replyText.classList.add('quick-reply-text')
        replyText.textContent = text;

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas');
        trashIcon.classList.add('fa-trash');
        
        //click event for the task
        replyText.addEventListener('click', (e) => {
            sendMessage(e.currentTarget.textContent);
            quickRepliesModal.classList.remove('show');
        })
        
        // click event for that trash can
        trashIcon.addEventListener('click', () => {
            // remove from de DOM
            newReply.remove();            
            // Delete it locally
            const index = quickReps.findIndex(item => item === text);
            if (index !== -1) quickReps.splice(index, 1);
            // Update QRs as deletion
            updateQuickReps(quickReps);
        })
        
        // Agregamos paragraph en el contenedor
        newReply.appendChild(replyText);
        // Agregamos trash-can en el contenedor
        newReply.appendChild(trashIcon);

        // Agregamos al contenedor de replies
        quickRepliesContainer.appendChild(newReply);
    }

    function generateRandomReplyId() {
        // Genera un ID con prefijo 'qr-' (quick reply) + timestamp + 4 caracteres aleatorios
        const timestamp = Date.now().toString(36); // Base36 para acortar
        const randomPart = Math.random().toString(36).substring(2, 6); // 4 caracteres aleatorios
        
        return `qr-${timestamp}-${randomPart}`;
    }

    // Create new qr item
    function createReplyModal() {
        // Abrir modal de crear nueva respuesta rápida
        openCreateQuickReply.addEventListener('click', () => {
            createQuickReplyModal.classList.add('show');
        });
        // Cerrar modal de crear nueva respuesta rápida
        cancelCreateQuickReply.addEventListener('click', () => {
            createQuickReplyModal.classList.remove('show');
        });
        // btn crear qr
        createReplyBtn.addEventListener('click', () => {
            // Mostramos modal de crear nuevo mensaje
            createQuickReplyModal.classList.remove('show');

            const newId = generateRandomReplyId()
            const textContent = newQrTextArea.value.trim();

            // creamos el mensaje en el DOM
            createQuickReply(textContent);
            // Pusheamos a la variable local
            quickReps.push(textContent);
            //Enviamos esa nueva qr a el backend
            updateQuickReps(quickReps);
        })
        createQuickReplyModal.addEventListener('click', (e) => {
            if (e.target === createQuickReplyModal) {
                createQuickReplyModal.classList.remove('show');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && createQuickReplyModal.classList.contains('show')) {
                createQuickReplyModal.classList.remove('show');
            }
        });
    }
    
    function repliesModalConfiguration() {
        // Abrir modal de respuestas rápidas desde el modal principal
        openQuickRepliesConfig.addEventListener('click', () => {
            mainConfigModal.classList.remove('show');
            quickRepliesModal.classList.add('show');
            quickRepliesContainer.innerHTML = ''    // Limpiamos

            quickReps.forEach(res => {
                createQuickReply(res); // Volvemos a generar
            })
        });
        // Cerrar modal de respuestas rápidas
        closeQuickReplies.addEventListener('click', () => {
            quickRepliesModal.classList.remove('show');
        });
        quickRepliesModal.addEventListener('click', (e) => {
            if (e.target === quickRepliesModal) {
                quickRepliesModal.classList.remove('show');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quickRepliesModal.classList.contains('show')) {
                quickRepliesModal.classList.remove('show');
            }
        });
        
        getQuickReps();
    }
    
    GeneralModalConfiguration();
    botModalConfiguration();
    repliesModalConfiguration();
    createReplyModal();
})
