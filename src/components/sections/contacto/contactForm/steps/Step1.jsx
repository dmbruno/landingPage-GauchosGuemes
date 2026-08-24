
export default function Step1({ stepStatus, formData, errors, handleChange, onNext }) {
  
  return (
    <div className={`contact-form form-step ${stepStatus}`}>
      <div className="form-header">
        <h3>Datos esenciales</h3>
        <p>Paso 1/4</p>
      </div>
      <div className="formInputContainer">
        <div className="form-group">
            <label>Tu nombre completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            <p className="error-text">{errors.name || ''}</p>
        </div>
        <div className="form-group">
            <label>DNI</label>
            <input type="number" name="dni" value={formData.dni} onChange={handleChange} />
            <p className="error-text">{errors.dni || ''}</p>
        </div>
        <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            <p className="error-text">{errors.email || ''}</p>
        </div>
        <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            <p className="error-text">{errors.phone || ''}</p>
        </div>
        


      </div>
      <div className="form-navigation">
        <button type="button" onClick={onNext} className="submit-btn">Siguiente</button>
      </div>
    </div>
  );
}