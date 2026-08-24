// src/components/ContactForm/steps/Step4.jsx

export default function Step4({ stepStatus, formData, acceptedTerms, handleTermsChange, onBack }) {
  
  return (
    <div className={`contact-form form-step ${stepStatus}`}>
      <div className="form-header">
        <h3>Revisá tu solicitud</h3>
        <p>Paso 4/4</p> 
      </div>
      <h4 className="contact-form-p">¡Tu reserva está casi lista! Revisá los datos antes de enviar.</h4>
      <div className="review-data">
        <p><strong>Nombre completo:</strong> {formData.name}</p>
        <p><strong>DNI:</strong> {formData.dni}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Teléfono:</strong> {formData.phone}</p>
        <p><strong>Fecha:</strong> {formData.date}</p>
        {(formData.eventType || formData.guestCount || formData.services) && (
          <>
            {formData.eventType && <p><strong>Tipo de evento:</strong> {formData.eventType}</p>}
            {formData.guestCount && <p><strong>Cantidad de personas:</strong> {formData.guestCount}</p>}
            {formData.services && <p><strong>Servicios requeridos:</strong> {formData.services}</p>}
          </> 
        )}
      </div>
      <div className="terms-group">
        <input type="checkbox" id="terms" name="terms" checked={acceptedTerms} onChange={handleTermsChange} />
        <label htmlFor="terms" className="terms-label">He leído y acepto los <a href="politicaDePrivacidad" target="_blank">Política de Privacidad y Tratamiento de Datos Personales</a>.</label>
      </div>
      <div className="form-navigation space-between">
        <button type="button" onClick={onBack} className="secondary-btn">Volver</button>
        <button type="submit" className="submit-btn celeste" disabled={!acceptedTerms}>Enviar por WhatsApp</button>
      </div>
    </div>
  );
}