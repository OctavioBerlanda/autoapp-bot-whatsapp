const { sendMessage } = require('../responder');
const admin = require('firebase-admin');

module.exports = async function handleStart(phone) {
  try {
    // Buscamos al usuario por su número de teléfono
    const userRef = await admin.firestore().collection('users').where('telefono', '==', phone).get();

    if (userRef.empty) {
      await sendMessage(phone, "No encontramos tu número en nuestra base de datos. ¿Podés verificar si estás registrado en la app?");
      return;
    }

    const user = userRef.docs[0].data();
    const tipo = user.tipo;
    const nombre = user.nombre;

    // Mensaje de bienvenida personalizado
    await sendMessage(phone, `¡Hola! Soy AutoAppBot 🚗\nEncantado de ayudarte, ${nombre}.`);

    // Opciones según el tipo de usuario
    let respuesta;
    if (tipo === 'concesionario') {
      respuesta = `¿En qué te puedo ayudar?\n1️⃣ Problemas para cargar subasta\n2️⃣ Consultas sobre pagos\n3️⃣ Otro`;
    } else {
      respuesta = `¿Qué necesitás?\n1️⃣ Info sobre subastas\n2️⃣ Soporte con la app\n3️⃣ Otro`;
    }

    await sendMessage(phone, respuesta);

  } catch (error) {
    console.error("Error al iniciar el flujo con el teléfono:", error);
    await sendMessage(phone, "Ocurrió un error al iniciar tu sesión. Por favor, intenta más tarde.");
  }
};
