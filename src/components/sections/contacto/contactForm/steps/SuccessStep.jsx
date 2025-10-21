// src/components/ContactForm/steps/SuccessStep.jsx
import React, { useEffect } from 'react';

// Ícono de Éxito
const SuccessIcon = () => (
<svg width="89" height="99" viewBox="0 0 89 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M37.3667 73.9958L72.0292 39.3333L65.1458 32.45L37.3667 60.2292L23.3542 46.2167L16.4708 53.1L37.3667 73.9958ZM9.83333 98.3333C7.12917 98.3333 4.81424 97.3705 2.88854 95.4448C0.962847 93.5191 0 91.2042 0 88.5V19.6667C0 16.9625 0.962847 14.6476 2.88854 12.7219C4.81424 10.7962 7.12917 9.83333 9.83333 9.83333H30.4833C31.5486 6.88333 33.3309 4.50694 35.8302 2.70417C38.3295 0.901389 41.1361 0 44.25 0C47.3639 0 50.1705 0.901389 52.6698 2.70417C55.1691 4.50694 56.9514 6.88333 58.0167 9.83333H78.6667C81.3708 9.83333 83.6858 10.7962 85.6115 12.7219C87.5372 14.6476 88.5 16.9625 88.5 19.6667V88.5C88.5 91.2042 87.5372 93.5191 85.6115 95.4448C83.6858 97.3705 81.3708 98.3333 78.6667 98.3333H9.83333ZM9.83333 88.5H78.6667V19.6667H9.83333V88.5ZM44.25 15.9792C45.3153 15.9792 46.1962 15.6309 46.8927 14.9344C47.5892 14.2378 47.9375 13.3569 47.9375 12.2917C47.9375 11.2264 47.5892 10.3455 46.8927 9.64896C46.1962 8.95243 45.3153 8.60417 44.25 8.60417C43.1847 8.60417 42.3038 8.95243 41.6073 9.64896C40.9108 10.3455 40.5625 11.2264 40.5625 12.2917C40.5625 13.3569 40.9108 14.2378 41.6073 14.9344C42.3038 15.6309 43.1847 15.9792 44.25 15.9792Z" fill="#688E85"/>
</svg>
);

// Ícono de Error
const ErrorIcon = () => (
  <svg width="89" height="99" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D93025"/>
  </svg>
);

export default function SuccessStep({ stepStatus, onMount, formError }) {
  
  // Pon tu número de WhatsApp aquí (con código de país, sin + ni 00)
  const whatsappNumber = '5493871234567'; // Ejemplo: 549 (Arg) + 387 (Salta) + 1234567
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola,%20tuve%20un%20problema%20al%20enviar%20el%20formulario%20de%20la%20web.`;

  useEffect(() => {
    // Limpia el storage SÓLO si el envío fue exitoso
    if (stepStatus === 'active' && !formError && onMount) {
      onMount();
    }
  }, [stepStatus, onMount, formError]);

  return (
    <div className={`contact-form success-message form-step ${stepStatus}`}>
      {/* Renderizado condicional */}
      {formError ? (
        <>
          <ErrorIcon />
          <h4>Ocurrió un problema</h4>
          <p>{formError}</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="submit-btn whatsapp-btn">
            Contactar por WhatsApp
          </a>
        </>
      ) : (
        <>
          <SuccessIcon />
          <h4>¡Tu reserva ha sido solicitada!</h4>
          <p>Nuestro equipo se pondrá en contacto pronto para coordinar la fecha y los detalles de tu evento.</p>
        </>
      )}
    </div>
  );
}