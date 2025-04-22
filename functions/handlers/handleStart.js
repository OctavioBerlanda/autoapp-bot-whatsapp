const { sendMessage } = require('../responder');
const admin = require('firebase-admin');

module.exports = async function handleStart(phone, email) {
  try {
    // Verificamos si el email existe en la base de datos
    const userRef = await admin.firestore().collection('users').where('email', '==', email).get();

    if (userRef.empty) {
      await sendMessage(phone, "No encontramos tu email en nuestra base de datos. ¿Podrías intentar nuevamente?");
      return;
    }

    const user = userRef.docs[0].data();
    const tipo = user.tipo;
    const nombre = user.nombre;

    let respuesta;
    if (tipo === 'concesionario') {
      respuesta = `Perfecto, ${nombre}. ¿En qué te puedo ayudar?\n1️⃣ Problemas para cargar subasta\n2️⃣ Consultas sobre pagos\n3️⃣ Otro`;
    } else {
      respuesta = `Genial, ${nombre}. ¿Qué necesitás?\n1️⃣ Info sobre subastas\n2️⃣ Soporte con la app\n3️⃣ Otro`;
    }

    await sendMessage(phone, respuesta);

  } catch (error) {
    console.error("Error al procesar el email:", error);
    await sendMessage(phone, "Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.");
  }
};
