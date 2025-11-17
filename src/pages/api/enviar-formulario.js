// src/pages/api/enviar-formulario.js

// 1. Obtenemos la clave secreta (desde .env)
const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

// 2. URLs de tu backend de Python
const CLIENTS_URL = 'https://gauchos-backend.onrender.com/api/clients';
const BOOKINGS_URL = 'https://gauchos-backend.onrender.com/api/bookings';

export async function POST({ request }) {
  try {
    // Obtenemos los datos que mandó React
    const data = await request.json();
    const { formData, acceptedTerms, recaptcha_token } = data;

    // --- TAREA 1: VALIDAR RECAPTCHA CON GOOGLE ---
    if (!recaptcha_token) {
      return new Response(JSON.stringify({ success: false, message: "Token reCAPTCHA faltante." }), { status: 400 });
    }

    const verifyResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptcha_token}`
    });

    const googleResponse = await verifyResponse.json();
    const puntajeMinimo = 0.5; // Puedes ajustar este umbral

    if (!googleResponse.success || googleResponse.score < puntajeMinimo) {
      console.warn("Fallo en reCAPTCHA:", googleResponse['error-codes']);
      return new Response(JSON.stringify({ success: false, message: "Verificación fallida. ¿Eres un robot?" }), { status: 400 });
    }

    // --- TAREA 2: (SI ES HUMANO) HACER PROXY A PYTHON ---
    console.log("reCAPTCHA validado. Enviando a Python...");

    // --- Lógica de división de nombre ---
    const fullText = formData.name.trim();
    const parts = fullText.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    // --- PASO A: POST 1 - Crear Cliente ---
    const clientPayload = {
      first_name: firstName,
      last_name: lastName, 
      email: formData.email,
      dni: formData.dni,
      phone: formData.phone,
      accepted_terms: acceptedTerms
    };

    const clientResponse = await fetch(CLIENTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientPayload)
    });

    if (!clientResponse.ok) {
      const errorData = await clientResponse.json();
      throw new Error(errorData.error || 'No se pudo registrar tus datos.');
    }

    const newClient = await clientResponse.json();
    const newClientId = newClient.id;

    if (!newClientId) {
      throw new Error('El backend de Python no devolvió un ID de cliente válido.');
    }

    // --- PASO B: POST 2 - Crear Reserva ---
    const VENUE_ID_FIJO = 1; 
    const bookingPayload = {
      client_id: newClientId,
      venue_id: VENUE_ID_FIJO,
      date: formData.date,
      guests_count: parseInt(formData.guestCount, 10) || 0,
      event_type: formData.eventType || null,
    };

    const bookingResponse = await fetch(BOOKINGS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });

    if (!bookingResponse.ok) {
      const errorData = await bookingResponse.json();
      throw new Error(errorData.error || 'Se registraron tus datos, pero falló la reserva de fecha.');
    }

    // --- ÉXITO TOTAL ---
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Formulario enviado con éxito." 
    }), { status: 200 });

  } catch (error) {
    // --- MANEJO DE CUALQUIER ERROR ---
    console.error('Error en /api/enviar-formulario:', error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Error en el servidor.' 
    }), { status: 500 });
  }
}