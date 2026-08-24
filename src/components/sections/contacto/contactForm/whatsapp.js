// Mismo número que el link de WhatsApp del footer (src/components/Footer.astro)
export const WHATSAPP_NUMBER = '5493874486464';

function formatFecha(dateString) {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function buildWhatsappMessage(formData) {
  const lineas = [
    'Hola! Quiero solicitar una reserva para un evento en Gauchos de Güemes.',
    '',
    `Nombre completo: ${formData.name}`,
    `DNI: ${formData.dni}`,
    `Email: ${formData.email}`,
    `Teléfono: ${formData.phone}`,
    `Fecha del evento: ${formatFecha(formData.date)}`,
  ];

  if (formData.eventType) lineas.push(`Tipo de evento: ${formData.eventType}`);
  if (formData.guestCount) lineas.push(`Cantidad de invitados: ${formData.guestCount}`);

  return lineas.join('\n');
}

export function buildWhatsappLink(formData) {
  const mensaje = buildWhatsappMessage(formData);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}
