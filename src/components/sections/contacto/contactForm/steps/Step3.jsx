// src/components/ContactForm/steps/Step3.jsx
export default function Step3({ stepStatus, formData, errors, handleChange, onNext, onBack }) {
  
  return (
    <div className={`contact-form form-step ${stepStatus}`}>
      <div className="form-header">
        <h3>Datos opcionales</h3>
        <p>Paso 3/4</p> {/* Actualizado */}
      </div>
      <p className="form-description">Completalos si querés que nuestro equipo tenga más información y pueda contactarte de forma rápida y personalizada.</p>
      <div className="formInputContainer">
        <div className="form-group">
            <label>Tipo de evento</label>
            <input type="text" name="eventType" value={formData.eventType} onChange={handleChange} />
            <p className="error-text">{errors.eventType || ''}</p>
        </div>
        <div className="form-group">
            <label>Cantidad estimada de personas</label>
            <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} />
            <p className="error-text">{errors.guestCount || ''}</p>
        </div>
        <div className="form-group">
            <label>Servicios requeridos</label>
            <input type="text" name="services" value={formData.services} onChange={handleChange} />
            <p className="error-text"></p>
        </div>
      </div>
      <div className="form-navigation space-between">
        <button type="button" onClick={onBack} className="secondary-btn">Volver</button>
        <button type="button" onClick={onNext} className="submit-btn">Siguiente</button>
      </div>
    </div>
  );
}