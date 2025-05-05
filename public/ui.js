import { currentItemId, currentFilter } from "./script.js"; // Variables
import { openItem, setCurrentFilter, filterItems, initilizeBotToggle } from "./script.js"; // Functions
import { sendManMessage, items } from './socket.js';

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
}


// Funciones para crear los items de comentarios y contactos
function createContactCard(contact) {
    // Container del contacto
    const contactElement = document.createElement('div');
    contactElement.className = `contact ${contact.id === currentItemId ? 'active' : ''}`; //WHAT THIS DOES IS THAT IF THE CONTACT ID IS THE SAME AS THE CURRENT ITEM ID, IT WILL ADD THE CLASS ACTIVE
    contactElement.dataset.platform = contact.platform;
    contactElement.dataset.itemId = contact.id;
    contactElement.dataset.type = contact.type;

    // Preview
    const preView = document.createElement('span');
    preView.className = 'contact-preview';
    preView.textContent = contact.messages[contact.messages.length - 1].content; // Ultimo mensaje

    // Container de la info del contacto
    const contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info';

    // Nombre del contacto
    const contactName = document.createElement('span');
    contactName.className = 'contact-name';
    contactName.textContent = contact.name;

    // Container de la plataforma
    const platform = document.createElement('div');
    platform.className = 'platform';
    
    // Span de la plataforma
    const platformName = document.createElement('span');
    platformName.textContent = contact.platform.charAt(0).toUpperCase() + contact.platform.slice(1);
    
    // Icono de la plataforma
    const platformIcon = document.createElement('i');
    platformIcon.className = `fab fa-${contact.platform} ${contact.platform}-icon`;

    // Span del tiempo del ultimo mensaje
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    messageTime.textContent = contact.lastMessageTime;

    // Platform Container <--- nombre e icono
    platform.appendChild(platformName);
    platform.appendChild(platformIcon);

    // Contact info <--- nombre, plataforma, hora de ultimo mensaje
    contactInfo.appendChild(contactName);
    contactInfo.appendChild(platform);
    contactInfo.appendChild(messageTime);

    // Contact element <--- El preview y la informacion del contacto
    contactElement.appendChild(preView);
    contactElement.appendChild(contactInfo);

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

    // Header container
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';

    // Nombre del user del comentario
    const commentName = document.createElement('span');
    commentName.className = 'contact-name';
    commentName.textContent = comment.name;

    // Logo con la C, para definir que es un comentario
    const typeIdentifier = document.createElement('span');
    typeIdentifier.className = 'type-identifier';
    typeIdentifier.textContent = 'C';

    // comments details container
    const commentDetails = document.createElement('div');
    commentDetails.classList.add('comment-details')
    
    // preview del titulo del post 
    const postTitle = document.createElement('span');
    postTitle.className = 'post-title';
    postTitle.textContent = comment.postTitle;

    // Platform container
    const platform = document.createElement('div');
    platform.className = 'platform';
    
    // Nombre de la plataforma de la que viene el comment
    const platformName = document.createElement('span');
    platformName.textContent = comment.platform.charAt(0).toUpperCase() + comment.platform.slice(1);
    
    // Logo de la plataforma
    const platformIcon = document.createElement('i');
    platformIcon.className = `fab fa-${comment.platform} ${comment.platform}-icon`;
    
    // Tiempo del ultimo mensaje enviado
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    messageTime.textContent = comment.lastMessageTime;

    // commentHeader <--- logo de C y nonbre del user
    commentHeader.appendChild(typeIdentifier);
    commentHeader.appendChild(commentName);

    // platform container <--- nombre de la plataforma e icono
    platform.appendChild(platformName);
    platform.appendChild(platformIcon);

    // Detalles <--- preview del post, plataforma, tiempo del ultimo mensaje enviado
    commentDetails.appendChild(postTitle);
    commentDetails.appendChild(platform);
    commentDetails.appendChild(messageTime);
    
    // Informacion del comentario <--- header, detalles, info (todos contenedores)
    commentInfo.appendChild(commentHeader);
    commentInfo.appendChild(commentDetails)
    commentElement.appendChild(commentInfo);

    return commentElement; // Retornamos el comment
}


// Actualizar la lista de items
export function updateItemsList(items, currentFilter) {
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
    // Función para actualizar el estado de los botones
    function updateFilterButtons() {
        chatButton.classList.toggle('active', currentFilter === 'contact');
        commentButton.classList.toggle('active', currentFilter === 'comment');
    }
    // Inicializar el estado de los botones
    updateFilterButtons();
    // Event listeners para los botones de filtro
    chatButton.addEventListener('click', () => {
        if (currentFilter !== 'contact') {
            setCurrentFilter('contacts');
            whatsAppToggle.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });
    commentButton.addEventListener('click', () => {
        if (currentFilter !== 'comment') {
            setCurrentFilter('comments');
            whatsAppToggle.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });


    // Bot configuration modal functionality
    const botConfigButton = document.querySelector('.bot-config-button');
    const botConfigModal = document.querySelector('.bot-config-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const cancelModalButtton = document.querySelector('.cancel-button');
    // Open modal
    botConfigButton.addEventListener('click', () => {
        botConfigModal.classList.add('show');
    });
    // Close modal with X button
    closeModalButton.addEventListener('click', () => {
        botConfigModal.classList.remove('show');
    });
    // Close modal with cancel button
    cancelModalButtton.addEventListener('click', () => {
        botConfigModal.classList.remove('show');
    });
    // Close modal when clicking outside
    botConfigModal.addEventListener('click', (e) => {
        if (e.target === botConfigModal) {
            botConfigModal.classList.remove('show');
        }
    });
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && botConfigModal.classList.contains('show')) {
            botConfigModal.classList.remove('show');
        }
    });
    
    
    // Send message functionality
    function sendMessage() {
        const input = document.querySelector('.message-input');
        const messageText = input.value.trim();
        if (!messageText) return
        
        // Obtener hora actual
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        //BUT FIRST WE NEED TO GET HOURS AND MINUTES
        
        // send message to the backend
        sendManMessage(currentItemId, "text", messageText, currentFilter); // (senderId (Meta), type, content) STILL NEEDS A PLATFORM AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        
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

        // Limpiar input
        input.value = '';
        
        // Scroll al final de los mensajes
        const messagesContainer = document.querySelector('.messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        filterItems();
    }

    document.querySelector('.send-button').addEventListener('click', sendMessage);

    document.querySelector('.message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
})
