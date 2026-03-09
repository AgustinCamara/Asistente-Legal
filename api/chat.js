/* api/chat.js
   serverless function de vercel que actua como proxy hacia groq.
   la api key se lee de las variables de entorno (nunca se expone al frontend).
   el frontend manda POST /api/chat con { messages, temperature, max_tokens, top_p }
   y esta funcion reenvía el request a groq y devuelve la respuesta. */

export default async function handler(req, res) {
  // solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) {
    console.error('GROQ_API_KEY no está configurada en las variables de entorno');
    return res.status(500).json({ error: 'API key no configurada en el servidor' });
  }

  try {
    const { messages, temperature = 0.4, max_tokens = 2048, top_p = 0.9 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'El campo "messages" es requerido y debe ser un array' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages,
        temperature,
        max_tokens,
        top_p
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error en el proxy:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
