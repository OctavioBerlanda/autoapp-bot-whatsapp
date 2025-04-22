const functions = require('firebase-functions');
const axios = require('axios');
const handleStart = require('./handlers/handleStart');

const admin = require('firebase-admin');
const { sendMessage } = require('./responder'); // Importamos la función para enviar mensajes

admin.initializeApp(); // Inicializa Firebase Admin

// Trigger para Firestore cuando se crea una nueva subasta
exports.notifyNewAuction = functions.firestore
  .document('auctions/{auctionId}')
  .onCreate(async (snap, context) => {
    const newAuction = snap.data();
    const usersSnapshot = await admin.firestore().collection('users').get();

    try {
      usersSnapshot.forEach(async (doc) => {
        const user = doc.data();
        const phone = user.phone;
        const message = `¡Nueva subasta disponible! 🏎️\n${newAuction.title}\nPrecio: ${newAuction.price}\nMás detalles en la app.`;

        // Intentamos enviar el mensaje
        try {
          await sendMessage(phone, message);
          console.log(`Mensaje enviado a ${phone}`);
        } catch (error) {
          console.error(`Error al enviar mensaje a ${phone}:`, error);
        }
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }

    console.log('Notificación de subasta enviada');
  });

exports.whatsappBot = functions.https.onRequest(async (req, res) => {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === 'TU_TOKEN_VERIFICACION') {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === 'POST') {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const phone = message.from;
    const normalizedText = (message.text?.body || '').trim().toLowerCase();

    // Si dice "hola", iniciamos el flujo directamente usando el teléfono
    if (['hola', 'hi', 'buenas'].includes(normalizedText)) {
      await handleStart(phone); // Ya no pasamos email, sólo el número
    } else {
      await sendMessage(phone, 'Perdón, no entendí. Escribí "hola" para empezar.');
    }

    return res.sendStatus(200);
  }

  return res.sendStatus(405);
});




