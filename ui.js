import { currentItemId, currentFilter } from "./script.js"; // Variables
import { openItem, setCurrentFilter, filterItems, initilizeBotToggle } from "./script.js"; // Functions
import { sendManMessage, items, quickReps, getQuickReps, updateQuickReps, sendBotConf, getCustomPrompt, botPrompts, tokenUsage, reportErrorToBackend, sendDebugMessage } from './socket.js';

// DOM Elements
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const attachButton = document.querySelector('.attach-button');
const imageFileInput = document.getElementById('image-file-input');
const imagePreviewContainer = document.querySelector('.image-preview-container');
const imagePreviewThumbnail = document.querySelector('.image-preview-thumbnail');
const imagePreviewFilename = document.querySelector('.image-preview-filename');
const imagePreviewCancelButton = document.querySelector('.image-preview-cancel-button');
const messagesContainer = document.querySelector('.messages');
const messageInputContainer = document.querySelector('.message-input-container');

let stagedImageFile = null; // To hold the image file before sending

export const tagColors = {
    'Venta': '#4CAF50',
    'Terminada': '#dd7d39'
}

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
    const currentDate = new Date(time);
    // 00:00 
    let horas = currentDate.getHours();
    const minutos = currentDate.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;
    horas = horas % 12;
    horas = horas ? horas : 12; // Si el resultado de % 12 es 0, significa que son las 12
    const tiempoFormateado = `${horas}:${minutosFormateados} ${ampm}`;
    // Creamos el span de tiempo
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = tiempoFormateado;

    // Añadir mensaje al chat
    messageContent.appendChild(timeSpan);
    messageElement.appendChild(messageContent);
    // Agregar al main container
    messagesContainer.appendChild(messageElement);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to handle image file (from input or drag-and-drop)
function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    
    // Show preview immediately using a fast, memory-efficient method
    const previewUrl = URL.createObjectURL(file);
    imagePreviewThumbnail.src = previewUrl;
    imagePreviewFilename.textContent = file.name;
    messageInput.style.display = 'none';
    imagePreviewContainer.style.display = 'flex';

    // Start the resizing and compression process
    resizeAndCompressImage(file).then(processedBlob => {
        stagedImageFile = processedBlob; // Store the processed blob for sending
        // The preview URL is temporary, so we can revoke it after we have the processed image
        URL.revokeObjectURL(previewUrl);
    }).catch(error => {
        console.error("Image processing failed:", error);
        sendDebugMessage(`Image processing failed: ${error.message}`);
        clearImagePreview(); // Clear preview if processing fails
        alert("There was an error processing the image. Please try again.");
    });
}

// New function to resize and compress the image
function resizeAndCompressImage(file, maxWidth = 1280, maxHeight = 1280, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(img.src); // Clean up the object URL

            let width = img.width;
            let height = img.height;

            // Calculate the new dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Get the processed image as a Blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas to Blob conversion failed'));
                    }
                },
                'image/jpeg',
                quality
            );
        };
        img.onerror = (error) => {
            URL.revokeObjectURL(img.src);
            reject(error);
        };
    });
}


// Function to send image message
function sendImageMessage() {
    if (!stagedImageFile) {
        sendDebugMessage("No staged image file to send.");
        return;
    }
    sendDebugMessage("Sending processed image message from cache.");

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Image = e.target.result;
        const recipientPlatform = items[currentFilter].list.find(item => item.id === currentItemId).platform;
        const messageTime = Date.now();

        sendManMessage(currentItemId, "image", base64Image, currentFilter, recipientPlatform);
        sendDebugMessage("Image sent to backend.");

        createMessage(base64Image, messageTime, 'bot', 'image');
        const entry = {
            content: base64Image,
            time: messageTime,
            type: "image",
            self: true
        }

        var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
        items[currentFilter].list.find(item => item.id === currentItemId)[entryKey].push(entry);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        filterItems();
        
        // Clear the staged image and revert UI
        clearImagePreview();
    };
    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        sendDebugMessage(`FileReader error: ${error.message}`);
        clearImagePreview();
        alert("Could not read the processed image. Please try again.");
    };
    reader.readAsDataURL(stagedImageFile);
}

// Function to clear image preview and revert UI
function clearImagePreview() {
    stagedImageFile = null;
    imagePreviewThumbnail.src = '';
    imagePreviewFilename.textContent = '';
    imagePreviewContainer.style.display = 'none';
    messageInput.style.display = 'block';
    messageInput.value = ''; // Clear any text that might have been there
}


// Funciones para crear los items de comentarios y contactos
function createContactCard(contact) {
    // Container del contacto
    const contactElement = document.createElement('div');
    contactElement.className = `contact ${contact.id === currentItemId ? 'active' : ''}`; //WHAT THIS DOES IS THAT IF THE CONTACT ID IS THE SAME AS THE CURRENT ITEM ID, IT WILL ADD THE CLASS ACTIVE
    contactElement.dataset.platform = contact.platform;
    contactElement.dataset.itemId = contact.id;
    contactElement.dataset.type = contact.type;

    // Agregamos la etiqueta de categoría si existe
    if (contact.tag !== 'default') {
        const tagElement = document.createElement('span');
        tagElement.className = 'contact-tag'; // Le damos una clase para estilizarla
        tagElement.id = `contact-tag-${contact.id}`
        tagElement.textContent = contact.tag;
        tagElement.style.backgroundColor = `${tagColors[contact.tag]}`
        contactElement.appendChild(tagElement);
    }

    if (contact.imgViewed === false) { // Si el contacto no ha visto la imagen, creamos un elemento de notificación de imagen
        //  SI ya existe el elemento de notificación de imagen, e imageVisualized es false, mostrar la notificación
        const currentImageNotification = document.getElementById(`image-notification-${contact.id}`);
        if (currentImageNotification) {
            currentImageNotification.style.display = 'block';
        } else {
            // Si no existe, creamos el elemento de notificación de imagen
            const imageNotificationElement = document.createElement('div');
            imageNotificationElement.className = 'image-notification';
            imageNotificationElement.id = `image-notification-${contact.id}`;
            imageNotificationElement.textContent = '🖼️';
            contactElement.appendChild(imageNotificationElement);
        }
    }

    // Preview
    const preView = document.createElement('span');
    preView.className = 'contact-preview';
    preView.textContent = contact.messages[contact.messages.length - 1].content; // Ultimo mensaje

    // Span del tiempo del ultimo mensaje
    const fecha = new Date(contact.messages[contact.messages.length -1].time);
    // dias
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // getMonth() devuelve 0-11, así que sumamos 1
    const year = fecha.getFullYear().toString().slice(-2);
    // horas
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';

    horas = horas % 12;
    horas = horas ? horas : 12; // Si el resultado de % 12 es 0, significa que son las 12

    // Aseguramos que el día, mes y minutos tengan dos dígitos (ej: 01, 05)
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;

    const tiempoFormateado = `${diaFormateado}/${mesFormateado}/${year} - ${horas}:${minutosFormateados} ${ampm}`;
    // creamos el span de tiempo del ultimo mensaje
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    messageTime.textContent = tiempoFormateado;

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
    const fecha = new Date(comment.comments[comment.comments.length -1].time);
    // dias
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // getMonth() devuelve 0-11, así que sumamos 1
    const year = fecha.getFullYear().toString().slice(-2);
    // horas
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const ampm = horas >= 12 ? 'PM' : 'AM';

    horas = horas % 12;
    horas = horas ? horas : 12; // Si el resultado de % 12 es 0, significa que son las 12

    // Aseguramos que el día, mes y minutos tengan dos dígitos (ej: 01, 05)
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;
    const tiempoFormateado = `${diaFormateado}/${mesFormateado}/${year} - ${horas}:${minutosFormateados} ${ampm}`;
    // Creamos span de tiempo 
    const messageTime = document.createElement('span');
    messageTime.className = 'contact-message-time';
    messageTime.textContent = tiempoFormateado;

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
        messagesContainer.innerHTML = '';
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

        // ocultamos la item list, al darle click al item, en caso que estemos en vista de telefono
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        if (mediaQuery.matches) {
            document.querySelector('.contacts-list').classList.toggle('show');
        }

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
    const tagBtnsContainer = document.querySelector('.tag-btn-container');
    const whatsAppToggle = document.getElementById('whatsapp-toggle');
    const linkTag = document.querySelector('.post-link');

    // Función para actualizar el estado de los botones
    function updateFilterButtons() {
        chatButton.classList.toggle('active', currentFilter === 'contacts');
        commentButton.classList.toggle('active', currentFilter === 'comments');
        
        // Hide/show attach button based on filter
        if (currentFilter === 'comments') {
            messageInputContainer.classList.add('hide-attach');
            clearImagePreview(); // Clear any staged image if switching to comments
        } else {
            messageInputContainer.classList.remove('hide-attach');
        }
    
        
        // Hide/show attach button based on filter
        if (currentFilter === 'comments') {
            messageInputContainer.classList.add('hide-attach');
            clearImagePreview(); // Clear any staged image if switching to comments
        } else {
            messageInputContainer.classList.remove('hide-attach');
        }
    }

    updateFilterButtons();
    // Event listeners para los botones de filtro
    chatButton.addEventListener('click', () => {
        if (currentFilter !== 'contacts') {
            setCurrentFilter('contacts');
            tagBtnsContainer.classList.toggle('active');
            whatsAppToggle.classList.toggle('active');
            linkTag.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });
    commentButton.addEventListener('click', () => {
        if (currentFilter !== 'comments') {
            setCurrentFilter('comments');
            tagBtnsContainer.classList.toggle('active');
            whatsAppToggle.classList.toggle('active');
            linkTag.classList.toggle('active');
            updateFilterButtons();
            filterItems();
        }
    });

    // Send message functionality
    function sendMessage(messageText) {
        if (stagedImageFile) {
            sendImageMessage();
            return;
        }

        if (!messageText) return

        const recipientPlatform = items[currentFilter].list.find(item => item.id === currentItemId).platform;
        const messageTime = Date.now();

        // send message to the backend
        sendManMessage(currentItemId, "text", messageText, currentFilter, recipientPlatform); // (senderId (Meta), type, content, platform)

        // create the message
        createMessage(messageText, messageTime, 'bot', 'text');
        // create the entry for the message
        const entry = {
            content: messageText,
            time: messageTime,
            type: "text",
            self: true
        }

        var entryKey = (currentFilter == "contacts") ? "messages" : (currentFilter == "comments") ? "comments" : null;
        items[currentFilter].list.find(item => item.id === currentItemId)[entryKey].push(entry);

        // Scroll al final de los mensajes
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        filterItems();
    }

    const handleInputMessage = () => {
        const messageValue = messageInput.value.trim();
        sendMessage(messageValue);
        messageInput.value = '';
    }

    sendButton.addEventListener('click', () => {
        handleInputMessage();
    });

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleInputMessage();
        }
    });

    // Image attachment and drag-and-drop
    const attachmentMenu = document.querySelector('.attachment-menu');
    const uploadImageBtn = document.getElementById('upload-image-btn');
    const takePhotoBtn = document.getElementById('take-photo-btn');

    attachButton.addEventListener('click', (e) => {
        e.preventDefault();
        attachmentMenu.style.display = attachmentMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    uploadImageBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the label's default behavior
        imageFileInput.removeAttribute('capture');
        imageFileInput.click();
        attachmentMenu.style.display = 'none';
    });

    takePhotoBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the label's default behavior
        imageFileInput.setAttribute('capture', 'camera');
        imageFileInput.click();
        attachmentMenu.style.display = 'none';
    });

    imageFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleImageFile(file);
    });

    imagePreviewCancelButton.addEventListener('click', clearImagePreview);

    messageInputContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
        if (currentFilter === 'contacts') { // Only allow drag-over for contacts
            messageInputContainer.classList.add('drag-over');
        }
    });

    messageInputContainer.addEventListener('dragleave', (event) => {
        event.preventDefault();
        messageInputContainer.classList.remove('drag-over');
    });

    messageInputContainer.addEventListener('drop', (event) => {
        event.preventDefault();
        messageInputContainer.classList.remove('drag-over');
        if (currentFilter === 'contacts') { // Only process drop for contacts
            const file = event.dataTransfer.files[0];
            handleImageFile(file);
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
    // console.log(botTextArea);
    

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
            botTextArea[1].value = 'Cargando...'; // cleaning the json table text area value
            botTextArea[2].value = 'Cargando...';
            botConfigModal.classList.add('show');
            await getCustomPrompt(); // Get the bot configuration
            botTextArea[0].value = botPrompts.prompt; // Set the bot configuration to the text area
            botTextArea[1].value = botPrompts.dataTable; // Set the bot configuration to the text area
            botTextArea[2].value = botPrompts.commentsPrompt; // Set the bot configuration to the text area
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
            const commentsPrompt = botTextArea[2].value.trim();

            if (botPrompt && dataTable && commentsPrompt) {
                // Validacion de si dataTable es JSON o no
                try {
                    JSON.parse(dataTable);
                } catch (e) {
                    alert('Texto formato JSON inválido, por favor ingreselo nuevamente')
                    console.error('dataTable, no es un JSON valido');
                    return;
                }
                // enviamos la info del bot
                sendBotConf(botPrompt, dataTable, commentsPrompt);
                // Ocultamos el modal
                botConfigModal.classList.remove('show');
                console.log('sent to back: ', botTextArea[0].value.trim(), botTextArea[1].value.trim(), botTextArea[2].value.trim())
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

//CAPTURE AND REPORT ERRORS
window.onerror = function (message, source, lineno, colno, error) {
  reportErrorToBackend({
    type: 'error',
    message,
    source,
    lineno,
    colno,
    stack: error?.stack
  });
};

// CAPTURE UNHANDLED PROMISE REJECTIONS
window.addEventListener('unhandledrejection', function (event) {
  reportErrorToBackend({
    type: 'unhandledrejection',
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack
  });
});
