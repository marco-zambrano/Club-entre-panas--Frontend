const items = {
    contacts: {
        allItemsLoaded: false,
        list: [
            {
                id: "a9f3c2d1e0b4",
                name: "John Smith",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m1a8d4c9b7f0", content: "salam aukjdfsajl", type: "audio", time: 1672576800000, self: false },
                    { id: "m4b7c2f1a3d9", content: "hello again", type: "text", time: 1672576860000, self: true }
                ]
            },
            {
                id: "e4c7a1b9f3d6",
                name: "John Doe",
                platform: "facebook",
                botEnabled: false,
                imgViewed: false,
                tag: [],
                read: true,
                messages: [
                    { id: "m8e9a3b1f2d4", content: "example cnotent", type: "text", time: 1672580400000, self: false, type: "text" },
                    { id: "m0c2d5a7b3e1", content: "https://picsum.photos/300/200", type: "image", time: 1672580460000, self: false },
                    { id: "m6b1f2e9a4d3", content: "ola si bolbiendo mireina", type: "text", time: 1672580520000, self: false }
                ]
            },
            {
                id: "b1c4e8f9a2d7",
                name: "Alice Gomez",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m9a6b3c2f1e7", content: "hi alice", type: "text", time: 1672584000000, self: true },
                    { id: "m4f8e1b9c3d2", content: "hello!", type: "text", time: 1672584060000, self: false }
                ]
            },
            {
                id: "f2a3c9b1d6e0",
                name: "Mike Chan",
                platform: "instagram",
                botEnabled: false,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m3e2a9f6b0c1", content: "are you there?", type: "text", time: 1672587600000, self: true },
                    { id: "m1c7b3e8a4f0", content: "yes I am", type: "text", time: 1672587660000, self: false },
                    { id: "m2a0f9b6e1c5", content: "cool", type: "text", time: 1672587720000, self: true }
                ]
            },
            {
                id: "d5f0a2c3e9b1",
                name: "Laura Fernández",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m8c3f1e0b7a2", content: "buenos días", type: "text", time: 1672591200000, self: false },
                    { id: "m2b5e1f9a4c3", content: "¿cómo estás?", type: "text", time: 1672591260000, self: false }
                ]
            },
            {
                id: "a7d9c0e1b3f4",
                name: "Carlos López",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m1f0a9c3e2b6", content: "me interesa mucho", type: "text", time: 1672594800000, self: false }
                ]
            },
            {
                id: "e8f3a6c1b0d2",
                name: "Diana Salas",
                platform: "instagram",
                botEnabled: true,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m5e9a0f3c2b7", content: "¿está disponible aún?", type: "text", time: 1672598400000, self: false },
                    { id: "m9b1f3a6c0e2", content: "sí, claro", type: "text", time: 1672598460000, self: true }
                ]
            },
            {
                id: "b6f0e9c3a2d1",
                name: "Jorge Ramírez",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m3c9f1a0e2b4", content: "necesito más info", type: "text", time: 1672602000000, self: false }
                ]
            },
            {
                id: "c9e2b0a1f3d6",
                name: "Andrea Méndez",
                platform: "facebook",
                botEnabled: true,
                imgViewed: false,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m0f1e3a9b6c4", content: "buenas noches", type: "text", time: 1672605600000, self: false },
                    { id: "m0f1e3a9b423", content: "https://picsum.photos/400/300", type: "image", time: 1672605600000, self: false },
                    { id: "m5a7c3f0e1b2", content: "igualmente", type: "text", time: 1672605660000, self: true }
                ]
            },
            {
                id: "f1b3d0a2c9e7",
                name: "Luis Torres",
                platform: "instagram",
                botEnabled: false,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m6b2f3e1a0c7", content: "me puedes llamar?", type: "text", time: 1672609200000, self: false }
                ]
            },
            {
                id: "a6c4b1e0f3d9",
                name: "Paula Rivera",
                platform: "facebook",
                botEnabled: true,
                imgViewed: false,
                tag: [],
                read: true,
                messages: [
                    { id: "m1c9a3f2e0b7", content: "te mandé mensaje", type: "text", time: 1672612800000, self: false },
                    { id: "m1c9a3san230", content: "https://picsum.photos/500/400", type: "image", time: 1672612800000, self: false },
                    { id: "m4f1e2b3c7a9", content: "lo vi, gracias", type: "text", time: 1672612860000, self: true }
                ]
            },
            {
                id: "d3b0f1a6e9c2",
                name: "Emilio Narváez",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m2a1c0f3e9b5", content: "listo para la reunión", type: "audio", time: 1672616400000, self: false },
                    { id: "m6f3e1b2a9c0", content: "perfecto", type: "text", time: 1672616460000, self: true },
                    { id: "fmdasj8s9293", content: "mock", type: "text", time: 1672616520000, self: false },
                    { id: "fdsa89439530", content: "mocko", type: "text", time: 1672616580000, self: true },
                    { id: "m8g9h1j2k3l4", content: "¿Llegarás a tiempo?", type: "text", time: 1672616640000, self: false },
                    { id: "m1a2b3c4d5e6", content: "Sí, ya voy en camino", type: "text", time: 1672616700000, self: true },
                    { id: "m7n8o9p0q1r2", content: "Genial, nos vemos pronto", type: "text", time: 1672616760000, self: false },
                    { id: "m3s4t5u6v7w8", content: "Perfecto, gracias", type: "text", time: 1672616820000, self: true }
                ]
            },
            {
                id: "c7f9e1b0a3d2",
                name: "María José",
                platform: "instagram",
                botEnabled: true,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m0e3f1a2c6b9", content: "me interesa el producto", type: "text", time: 1672620000000, self: false }
                ]
            },
            {
                id: "f0e2c3a1b9d8",
                name: "Ramón Castillo",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m7a2c0e1f3b6", content: "gracias por responder", type: "audio", time: 1672623600000, self: false },
                    { id: "m3b9f1e2a0c8", content: "a la orden", type: "text", time: 1672623660000, self: true }
                ]
            },
            {
                id: "b8f2d3e1a0c6",
                name: "Fernanda Díaz",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m1e9a3f0b7c2", content: "hay descuento?", type: "text", time: 1672627200000, self: false },
                    { id: "m4c0f1e2b6a3", content: "sí, del 10%", type: "text", time: 1672627260000, self: true }
                ]
            },
            {
                id: "e1c0a9f2b3d7",
                name: "Sebastián León",
                platform: "instagram",
                botEnabled: false,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m3f9e1a0b2c6", content: "cuándo llega el pedido?", type: "audio", time: 1672630800000, self: false }
                ]
            },
            {
                id: "a0e1b2c3f9d6",
                name: "Natalia Bravo",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m9c2b1f0e3a7", content: "recibí el producto", type: "text", time: 1672634400000, self: false },
                    { id: "m2f0e3a6b1c9", content: "¡qué bueno!", type: "text", time: 1672634460000, self: true }
                ]
            },
            {
                id: "1b3a7c9d2e0f",
                name: "Sofía Vargas",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m7d9e2c1b0a3", content: "hola, estoy interesada en el servicio", type: "text", time: 1672638000000, self: false },
                    { id: "m0a3b7c2e9f1", content: "¡Hola! ¿En qué puedo ayudarte?", type: "text", time: 1672638060000, self: true }
                ]
            },
            {
                id: "9f2e0a1c3b7d",
                name: "Javier Ponce",
                platform: "instagram",
                botEnabled: false,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m2c9f0a3e1b7", content: "tienes stock?", type: "text", time: 1672641600000, self: false }
                ]
            },
            {
                id: "c6a1f3e0b9d2",
                name: "Isabela Castro",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m8b0d2e1f9a3", content: "gracias por la información", type: "text", time: 1672645200000, self: false },
                    { id: "m1a9f3e0c2b8", content: "de nada!", type: "text", time: 1672645260000, self: true }
                ]
            },
            {
                id: "3d9e1b7f0a2c",
                name: "Martín Rueda +593 98 4973 460",
                platform: "whatsapp",
                botEnabled: false,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m5f0a2c9e1b3", content: "ok, entendido", type: "text", time: 1672648800000, self: false }
                ]
            },
            {
                id: "e0b7d2a9f1c3",
                name: "Valeria Guzmán",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m9a1c3f0e2b7", content: "cuando envías?", type: "text", time: 1672652400000, self: false },
                    { id: "m4e2b0a1f9c3", content: "mañana mismo", type: "text", time: 1672652460000, self: true }
                ]
            },
            {
                id: "b2c6f0a1d9e3",
                name: "Andrés Vargas",
                platform: "instagram",
                botEnabled: false,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m1f9e3a0c2b6", content: "¿cómo hago el pago?", type: "text", time: 1672656000000, self: false }
                ]
            },
            {
                id: "f3a9c2e1b0d7",
                name: "Carolina Paz",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m7c0b1f9e2a3", content: "me confirmas la dirección?", type: "text", time: 1672659600000, self: false },
                    { id: "m0e2a9f3c1b7", content: "claro, es...", type: "text", time: 1672659660000, self: true }
                ]
            },
            {
                id: "a1d7e0c9b3f2",
                name: "Diego Rojas",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m3c9f1a0e2b4", content: "gracias por tu tiempo", type: "text", time: 1672663200000, self: false }
                ]
            },
            {
                id: "d8b3f2a1c0e9",
                name: "Elena Flores Elena Zambrano +593 98 4973 460",
                platform: "whatsapp",
                botEnabled: true,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m6c9a0f3e1b2", content: "excelente servicio!", type: "text", time: 1672666800000, self: false },
                    { id: "m2e1b7f0a9c3", content: "nos alegra mucho!", type: "text", time: 1672666860000, self: true }
                ]
            },
            {
                id: "c0e9a1f2b3d8",
                name: "Gabriel Núñez",
                platform: "instagram",
                botEnabled: false,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m9f3e1b2a0c6", content: "tienen alguna promoción?", type: "text", time: 1672670400000, self: false }
                ]
            },
            {
                id: "f2b7d0a1e9c3",
                name: "Jimena Suárez",
                platform: "facebook",
                botEnabled: true,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m1a0c6f9e2b3", content: "ya hice la transferencia", type: "text", time: 1672674000000, self: false },
                    { id: "m4d9e3b1c0a2", content: "perfecto, lo reviso", type: "text", time: 1672674060000, self: true }
                ]
            },
            {
                id: "a8c3f1e0b9d4",
                name: "Héctor Vargas",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m7e2b0a1f3c9", content: "necesito ayuda con la instalación", type: "text", time: 1672677600000, self: false }
                ]
            },
            {
                id: "d1e9b0a2c3f7",
                name: "Liliana Castro +593 98 4973 460",
                platform: "whatsapp",
                botEnabled: true,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m2c0f3a9e1b8", content: "me encantó el producto, gracias!", type: "text", time: 1672681200000, self: false },
                    { id: "m5a8b1c0f3e2", content: "¡Qué bueno que te gustó!", type: "text", time: 1672681260000, self: true }
                ]
            },
            {
                id: "b4f0a2c9e1d3",
                name: "Oscar Pérez",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m8e1c3f0a9b2", content: "cuando abren mañana?", type: "text", time: 1672684800000, self: false }
                ]
            },
            {
                id: "e7c2a9f1b0d6",
                name: "Paola Ruiz",
                platform: "instagram",
                botEnabled: true,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m3a6f0e1c9b2", content: "tienen servicio a domicilio?", type: "text", time: 1672688400000, self: false },
                    { id: "m6b9c2f1a0e3", content: "sí, con costo adicional", type: "text", time: 1672688460000, self: true }
                ]
            },
            {
                id: "c9a3f0e1b2d7",
                name: "Raúl Flores",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m1b7d0a2c9f3", content: "no me llegó la confirmación", type: "text", time: 1672692000000, self: false }
                ]
            },
            {
                id: "f0d6b1a2c9e3",
                name: "Silvia Guzmán +593 98 4973 460",
                platform: "whatsapp",
                botEnabled: true,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m4a9c3f0e1b7", content: "todo perfecto, muchas gracias!", type: "text", time: 1672695600000, self: false },
                    { id: "m7e1b0a2f9c3", content: "a ti por tu compra!", type: "text", time: 1672695660000, self: true }
                ]
            },
            {
                id: "a2e7c0f1b3d9",
                name: "Tomás Pérez",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m9c3f0a1e2b7", content: "no entiendo cómo funciona", type: "text", time: 1672699200000, self: false }
                ]
            },
            {
                id: "d5c9b1a0f3e8",
                name: "Ursula Ruiz",
                platform: "instagram",
                botEnabled: true,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m2f0e1b9c3a7", content: "puedo pagar con tarjeta?", type: "text", time: 1672702800000, self: false },
                    { id: "m5b1c7f0a9e2", content: "sí, aceptamos tarjetas", type: "text", time: 1672702860000, self: true }
                ]
            },
            {
                id: "b8a1f3e0c2d9",
                name: "Víctor Flores",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m1c0f9a3e2b7", content: "cuando tienen nuevos modelos?", type: "text", time: 1672706400000, self: false }
                ]
            },
            {
                id: "e1f0a9c3b2d8",
                name: "Wendy Guzmán +593 98 4973 460",
                platform: "whatsapp",
                botEnabled: true,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m4b7c0f1e9a2", content: "ya recomendé su página a mis amigos", type: "text", time: 1672710000000, self: false },
                    { id: "m7a2f9e0c1b3", content: "¡Muchas gracias!", type: "text", time: 1672710060000, self: true }
                ]
            },
            {
                id: "c3d8b1a0f2e9",
                name: "Xavier Pérez",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: ['Terminado'],
                read: true,
                messages: [
                    { id: "m9e2c0f1b7a3", content: "no me responden los mensajes", type: "text", time: 1672713600000, self: false }
                ]
            },
            {
                id: "f9a2e0c1b3d8",
                name: "Yolanda Ruiz",
                platform: "instagram",
                botEnabled: true,
                imgViewed: true,
                tag: ['RP'],
                read: true,
                messages: [
                    { id: "m2b7f0a1e9c3", content: "me llegó antes de lo esperado, genial!", type: "text", time: 1672717200000, self: false },
                    { id: "m5c0a9f3e1b2", content: "¡Nos alegramos mucho!", type: "text", time: 1672717260000, self: true }
                ]
            },
            {
                id: "a1b8d0c2e9f3",
                name: "Zacarias Flores",
                platform: "facebook",
                botEnabled: false,
                imgViewed: true,
                tag: [],
                read: true,
                messages: [
                    { id: "m8f3e1b0a2c7", content: "tienen tienda física?", type: "text", time: 1672720800000, self: false }
                ]
            }
        ]
    },
    comments: {
        allItemsLoaded: false,
        list: [
            {
                userId: "c2a0f3b1e8d6",
                postId: "sj1n1324nj2n",
                name: "Juan Perez",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/sj1n1324nj2n",
                read: true,
                comments: [
                    {
                        id: "cm1f0b3e2a9c",
                        content: "hola me interesa",
                        type: "text",
                        time: 1672724400000,
                        self: false
                    },
                    {
                        id: "cm9a6c1f0b3e",
                        content: "todavía lo tienes?",
                        type: "text",
                        time: 1672724410000,
                        self: false
                    }
                ]
            },
            {
                userId: "e7c1a3b0d9f5",
                postId: "dsasnajn1ijd",
                name: "Lucía Herrera",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/dsasnajn1ijd",
                read: false,
                comments: [
                    {
                        id: "cm4f8a9b2c0e",
                        content: "precio?",
                        type: "text",
                        time: 1672728000000,
                        self: false
                    },
                    {
                        id: "cm3b7f0e1a2c",
                        content: "¿envías a Quito?",
                        type: "text",
                        time: 1672728010000,
                        self: false
                    }
                ]
            },
            {
                userId: "b9a2f0e1c6d3",
                postId: "24dewfe3fe2e",
                name: "Marco Aguirre",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/24dewfe3fe2e",
                read: true,
                comments: [
                    {
                        id: "cm2e1a0f9b4c",
                        content: "¿tienes más colores?",
                        type: "text",
                        time: 1672731600000,
                        self: false
                    }
                ]
            },
            {
                userId: "f0c9e3a2b1d6",
                postId: "f2f3f43f53f5",
                name: "Sofía Molina",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/f2f3f43f53f5",
                read: true,
                comments: [
                    {
                        id: "cm0b1f3e6a2c",
                        content: "me encanta 😍",
                        type: "text",
                        time: 1672735200000,
                        self: false
                    }
                ]
            },
            {
                userId: "a2f1e0b9c3d4",
                postId: "5343tf4gt5hh",
                name: "Daniel Ruiz",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/5343tf4gt5hh",
                read: true,
                comments: [
                    {
                        id: "cm5a3e1b0f9c",
                        content: "quiero uno",
                        type: "text",
                        time: 1672738800000,
                        self: false
                    },
                    {
                        id: "cm8c9f0a2e1b",
                        content: "responde porfa",
                        type: "text",
                        time: 1672738810000,
                        self: false
                    }
                ]
            },
            {
                userId: "d1f3a6e0c9b2",
                postId: "121e21f5g65h",
                name: "Valentina Ríos",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/121e21f5g65h",
                read: true,
                comments: [
                    {
                        id: "cm1b0c3f2a9e",
                        content: "¡Está hermoso!",
                        type: "text",
                        time: 1672742400000,
                        self: false
                    },
                    {
                        id: "cm2c8e1f3a0b",
                        content: "¿aceptas transferencias?",
                        type: "text",
                        time: 1672742410000,
                        self: false
                    }
                ]
            },
            {
                userId: "c3f9b0e1d6a2",
                postId: "2343232d32dd",
                name: "Luis Gómez",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/2343232d32dd",
                read: true,
                comments: [
                    {
                        id: "cm7e2b9f0c1a",
                        content: "¿Dónde estás ubicado?",
                        type: "text",
                        time: 1672746000000,
                        self: false
                    }
                ]
            },
            {
                userId: "e6a1c0f2b9d3",
                postId: "g76h76h87h7h",
                name: "Camila Torres",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/g76h76h87h7h",
                read: true,
                comments: [
                    {
                        id: "cm3a6f1b0e9c",
                        content: "Me interesa para regalo",
                        type: "text",
                        time: 1672749600000,
                        self: false
                    },
                    {
                        id: "cm6b0c1f2a9e",
                        content: "¿Tienes en otros tamaños?",
                        type: "text",
                        time: 1672749610000,
                        self: false
                    }
                ]
            },
            {
                userId: "a3d2c1b9f0e6",
                postId: "dn29ud392dn9",
                name: "Mateo Sánchez",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/dn29ud392dn9",
                read: true,
                comments: [
                    {
                        id: "cm9e1b0a2f3c",
                        content: "revisé mi inbox",
                        type: "text",
                        time: 1672753200000,
                        self: false
                    }
                ]
            },
            {
                userId: "f9b0a2d1e6c3",
                postId: "juhgk90hkr0i",
                name: "Andrea Jaramillo",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/juhgk90hkr0i",
                read: true,
                comments: [
                    {
                        id: "cm2f0e3a6b1c",
                        content: "te acabo de escribir",
                        type: "text",
                        time: 1672756800000,
                        self: false
                    }
                ]
            },
            {
                userId: "1c9a7f3e0b2d",
                postId: "d2dn94r4rn44",
                name: "Pedro Guzmán",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/d2dn94r4rn44",
                read: true,
                comments: [
                    {
                        id: "cm7d2e9f0a1b",
                        content: "se ve interesante",
                        type: "text",
                        time: 1672760400000,
                        self: false
                    }
                ]
            },
            {
                userId: "9e2b0a1c3f7d",
                postId: "392rh392rn39",
                name: "Isabel Ríos",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/392rh392rn39",
                read: true,
                comments: [
                    {
                        id: "cm3f0a2c9e1b",
                        content: "quiero saber más",
                        type: "text",
                        time: 1672764000000,
                        self: false
                    },
                    {
                        id: "cm6a1c9f0b3e",
                        content: "algún número de contacto?",
                        type: "text",
                        time: 1672764010000,
                        self: false
                    }
                ]
            },
            {
                userId: "c7f0a3b1e2d9",
                postId: "hf239f239f23",
                name: "Carlos Velez",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/hf239f239f23",
                read: true,
                comments: [
                    {
                        id: "cm0b1f3e6a2c",
                        content: "no me convence mucho",
                        type: "text",
                        time: 1672767600000,
                        self: false
                    }
                ]
            },
            {
                userId: "f3d9b0a1e2c6",
                postId: "121e32e32eff",
                name: "Elena Paz",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/121e32e32eff",
                read: true,
                comments: [
                    {
                        id: "cm5e1a0f9b2c",
                        content: "gracias por la atención",
                        type: "text",
                        time: 1672771200000,
                        self: false
                    }
                ]
            },
            {
                userId: "a0c6f9e1b3d2",
                postId: "f45h6h76h78j",
                name: "Javier Soto",
                platform: "instagram",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/f45h6h76h78j",
                read: true,
                comments: [
                    {
                        id: "cm8b2f0e1a9c",
                        content: "necesito ver más fotos",
                        type: "text",
                        time: 1672774800000,
                        self: false
                    }
                ]
            },
            {
                userId: "d2b9f0a1e3c7",
                postId: "j87j87j87j89",
                name: "Mariana León",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/j87j87j87j89",
                read: true,
                comments: [
                    {
                        id: "cm1a6f3e0b2c",
                        content: "es justo lo que buscaba!",
                        type: "text",
                        time: 1672778400000,
                        self: false
                    }
                ]
            },
            {
                userId: "b5f0a2c9e1d8",
                postId: "od0k0ed20d9f",
                name: "Roberto Castro",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/od0k0ed20d9f",
                read: true,
                comments: [
                    {
                        id: "cm4c9f0a1e2b",
                        content: "algún video del producto?",
                        type: "text",
                        time: 1672782000000,
                        self: false
                    }
                ]
            },
            {
                userId: "e8c1a3f0b9d2",
                postId: "f42j9f292j2f",
                name: "Silvia Vargas",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/f42j9f292j2f",
                read: true,
                comments: [
                    {
                        id: "cm7f0a2c9e1b",
                        content: "me avisas si hay novedades",
                        type: "text",
                        time: 1672785600000,
                        self: false
                    }
                ]
            },
            {
                userId: "c1a9f3e0b2d7",
                postId: "fff2f2f2f55f",
                name: "Andrés Ruiz",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/fff2f2f2f55f",
                read: true,
                comments: [
                    {
                        id: "cm0e2b9f1a3c",
                        content: "gracias por la info!",
                        type: "text",
                        time: 1672789200000,
                        self: false
                    }
                ]
            },
            {
                userId: "f7d2b0a1e9c3",
                postId: "54t5454g54g5",
                name: "Laura Soto",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/54t5454g54g5",
                read: true,
                comments: [
                    {
                        id: "cm3a9f0e1c2b",
                        content: "ya compartí con mis amigos",
                        type: "text",
                        time: 1672792800000,
                        self: false
                    }
                ]
            },
            {
                userId: "a4f0c9e1b2d6",
                postId: "llfds99ds0ff",
                name: "Diego Paz",
                platform: "instagram",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/llfds99ds0ff",
                read: true,
                comments: [
                    {
                        id: "cm6c1f0a9e2b",
                        content: "no es lo que esperaba",
                        type: "text",
                        time: 1672796400000,
                        self: false
                    }
                ]
            },
            {
                userId: "d9b2f0a1e3c8",
                postId: "fdsfdsn99191",
                name: "Valeria Castro",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/fdsfdsn99191",
                read: true,
                comments: [
                    {
                        id: "cm9f0a2c1b3e",
                        content: "cuando llega mi pedido?",
                        type: "text",
                        time: 1672800000000,
                        self: false
                    }
                ]
            },
            {
                userId: "b1c8f0a2e3d9",
                postId: "43r43rc3cvfg",
                name: "Martín León",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/43r43rc3cvfg",
                read: true,
                comments: [
                    {
                        id: "cm2e0b9f1a3c",
                        content: "tienen alguna garantía?",
                        type: "text",
                        time: 1672803600000,
                        self: false
                    }
                ]
            },
            {
                userId: "e0a3f9c1b2d7",
                postId: "y76b76u6bbbc",
                name: "Carolina Soto",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/y76b76u6bbbc",
                read: true,
                comments: [
                    {
                        id: "cm5b1f0a2c9e",
                        content: "me encanta su atención!",
                        type: "text",
                        time: 1672807200000,
                        self: false
                    }
                ]
            },
            {
                userId: "c6d9b0a1e2f3",
                postId: "1c21e21ce21e",
                name: "Gabriel Paz",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/1c21e21ce21e",
                read: true,
                comments: [
                    {
                        id: "cm8a2f0e1b9c",
                        content: "no encuentro lo que busco",
                        type: "text",
                        time: 1672810800000,
                        self: false
                    }
                ]
            },
            {
                userId: "f2a7c0e1b9d3",
                postId: "tc5t45c5tc5v",
                name: "Jimena Castro",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/tc5t45c5tc5v",
                read: true,
                comments: [
                    {
                        id: "cm1c9f0a2e3b",
                        content: "ya les escribí al inbox",
                        type: "text",
                        time: 1672814400000,
                        self: false
                    }
                ]
            },
            {
                userId: "a9e3b0c1f2d8",
                postId: "0d01j0dj0cj0",
                name: "Héctor León",
                platform: "instagram",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/0d01j0dj0cj0",
                read: true,
                comments: [
                    {
                        id: "cm4f0a2c9b1e",
                        content: "tienen ofertas especiales?",
                        type: "text",
                        time: 1672818000000,
                        self: false
                    }
                ]
            },
            {
                userId: "d1c7f0a2e3b9",
                postId: "c1jc0j29cn9d",
                name: "Liliana Soto",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/c1jc0j29cn9d",
                read: true,
                comments: [
                    {
                        id: "cm7b2f0e1a9c",
                        content: "gracias por la ayuda!",
                        type: "text",
                        time: 1672821600000,
                        self: false
                    }
                ]
            },
            {
                userId: "b4f0a2c9e1d3",
                postId: "cj19cd1nc91n",
                name: "Oscar Paz",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/cj19cd1nc91n",
                read: true,
                comments: [
                    {
                        id: "cm0c9f1a2e3b",
                        content: "no me gustó mucho",
                        type: "text",
                        time: 1672825200000,
                        self: false
                    }
                ]
            },
            {
                userId: "e7c3b0a1c2d9",
                postId: "fkpjfpdgj0fd",
                name: "Paola Castro",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/fkpjfpdgj0fd",
                read: true,
                comments: [
                    {
                        id: "cm3a2f0e1b9c",
                        content: "cuando tienen nuevos productos?",
                        type: "text",
                        time: 1672828800000,
                        self: false
                    }
                ]
            },
            {
                userId: "c0b9f1a2e3d6",
                postId: "f2jfj20fje0j",
                name: "Raúl León",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/f2jfj20fje0j",
                read: true,
                comments: [
                    {
                        id: "cm6f0a2c9b1e",
                        content: "necesito factura",
                        type: "text",
                        time: 1672832400000,
                        self: false
                    }
                ]
            },
            {
                userId: "f3c6a0e1b9d2",
                postId: "jfdsjd0s0vc0",
                name: "Silvia Soto",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/jfdsjd0s0vc0",
                read: true,
                comments: [
                    {
                        id: "cm9b2f0e1a3c",
                        content: "son los mejores!",
                        type: "text",
                        time: 1672836000000,
                        self: false
                    }
                ]
            },
            {
                userId: "a6d2b0c1f9e3",
                postId: "nbvnbvn33g33",
                name: "Tomás Paz",
                platform: "instagram",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/nbvnbvn33g33",
                read: true,
                comments: [
                    {
                        id: "cm2c9f0a1e3b",
                        content: "no responden rápido",
                        type: "text",
                        time: 1672839600000,
                        self: false
                    }
                ]
            },
            {
                userId: "d9a1f3e0c2b7",
                postId: "vcxvc2fef2f2",
                name: "Ursula Castro",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/vcxvc2fef2f2",
                read: true,
                comments: [
                    {
                        id: "cm5f0a2c9b1e",
                        content: "me ayudan con una duda?",
                        type: "text",
                        time: 1672843200000,
                        self: false
                    }
                ]
            },
            {
                userId: "b2e7c0f1a9d3",
                postId: "mvlfdmvfldm2",
                name: "Víctor León",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/mvlfdmvfldm2",
                read: true,
                comments: [
                    {
                        id: "cm8c9f0a2e1b",
                        content: "tienen catálogo?",
                        type: "text",
                        time: 1672846800000,
                        self: false
                    }
                ]
            },
            {
                userId: "e1c3a9f0b2d8",
                postId: "vmmvkowo2022",
                name: "Wendy Soto",
                platform: "instagram",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/vmmvkowo2022",
                read: true,
                comments: [
                    {
                        id: "cm1b9f0a2c3e",
                        content: "excelente atención al cliente!",
                        type: "text",
                        time: 1672850400000,
                        self: false
                    }
                ]
            },
            {
                userId: "c8f0a2e1b3d9",
                postId: "mfodsjofdso3",
                name: "Xavier Paz",
                platform: "facebook",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/mfodsjofdso3",
                read: true,
                comments: [
                    {
                        id: "cm4e2b9f0a1c",
                        content: "no me funciona el link",
                        type: "text",
                        time: 1672854000000,
                        self: false
                    }
                ]
            },
            {
                userId: "f5a1c9e0b2d3",
                postId: "mfkdsmodsn99",
                name: "Yolanda Castro",
                platform: "facebook",
                botEnabled: true,
                permalink: "https://www.linkfalso.com/mfkdsmodsn99",
                read: true,
                comments: [
                    {
                        id: "cm7a2f0e1b9c",
                        content: "gracias por su paciencia",
                        type: "text",
                        time: 1672857600000,
                        self: false
                    }
                ]
            },
            {
                userId: "a2d8b0c1f9e6",
                postId: "217683biyfgb",
                name: "Zacarias León",
                platform: "instagram",
                botEnabled: false,
                permalink: "https://www.linkfalso.com/217683biyfgb",
                read: true,
                comments: [
                    {
                        id: "cm0f9a2c1b3e",
                        content: "tienen página web?",
                        type: "text",
                        time: 1672861200000,
                        self: false
                    }
                ]
            }
        ]
    }
};

module.exports = items;