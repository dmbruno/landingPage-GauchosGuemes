

export default function Step1({ formData, errors, handleChange, onNext }) {
  return (
    <div className="contact-form">
      <div className="form-header">
        <h3>Datos esenciales</h3>
        <p>Paso 1/3</p>
      </div>
      <div className="formInputContainer">
        <div className="form-group">
            <label>Tu nombre completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
        <div className="form-group">
            <label>DNI</label>
            <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
            {errors.dni && <p className="error-text">{errors.dni}</p>}
        </div>
        <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
        <div className="form-group">
            <label>Fecha</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
            {errors.date && <p className="error-text">{errors.date}</p>}
        </div>
      </div>
      <div className="form-navigation">
        <button onClick={onNext} className="submit-btn">Siguiente</button>
      </div>
    </div>
  );
}