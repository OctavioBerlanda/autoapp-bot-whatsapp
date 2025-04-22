/*Acá guardamos las sesiones de los usuarios en la base de datos de Firestore.
La colección se llama "sessions" y cada documento tiene el ID del número de teléfono del usuario.

La estructura del documento es la siguiente:
{
"phone": "+5493411234567",
"step": "userType", // paso actual del flujo
"tipo": "usuario",  // o "concesionario"
"ultimaOpcion": null,
"timestamp": "2025-04-22T12:00:00Z"
}

---------------------------------------------------------------------------------------------------------------------------
Ejemplos de posibles valores para el step:
userType: Este paso ocurre después de que el usuario introduce su correo. Aquí le preguntas si es un concesionario o un usuario.

opcionSeleccionada: Este paso podría ocurrir después de que el usuario elige entre las opciones disponibles, como "Problemas para cargar subasta", "Consultas sobre pagos", etc.

finalizado: Este paso podría ser cuando la conversación ha terminado o cuando el usuario ha completado su interacción.
---------------------------------------------------------------------------------------------------------------------------

*/
