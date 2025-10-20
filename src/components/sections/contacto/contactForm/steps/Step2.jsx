
export default function Step2({ formData, errors, handleChange, onNext, onBack }) {
  return (
    <div className="contact-form">
      <div className="form-header">
        <h3>Datos opcionales</h3>
        <p>Paso 2/3</p>
      </div>
      <p className="form-description">Completalos si querés que nuestro equipo tenga más información y pueda contactarte de forma rápida y personalizada.</p>
      <div className="formInputContainer">
        <div className="form-group">
            <label>Tipo de evento</label>
            <input type="text" name="eventType" value={formData.eventType} onChange={handleChange} />
            {errors.eventType && <p className="error-text">{errors.eventType}</p>}
        </div>
        <div className="form-group">
            <label>Cantidad estimada de personas</label>
            <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} />
            {errors.guestCount && <p className="error-text">{errors.guestCount}</p>}
        </div>
        <div className="form-group">
            <label>Servicios requeridos</label>
            <input type="text" name="services" value={formData.services} onChange={handleChange} />
        </div>
      </div>
      <div className="form-navigation space-between">
        <button onClick={onBack} className="secondary-btn">Volver</button>
        <button onClick={onNext} className="submit-btn">Siguiente</button>
      </div>
    </div>
  );
}