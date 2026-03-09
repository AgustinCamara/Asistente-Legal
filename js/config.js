/* config.js
   configuracion de la app. la api key ya NO esta aca, ahora vive
   segura en el servidor (vercel serverless function).
   el frontend solo llama a /api/chat y el server se encarga del resto.
   este archivo tiene que cargarse antes que api.js y chat.js. */

const API_URL = '/api/chat';
