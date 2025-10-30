// src/components/ContactForm/steps/Step2.jsx
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker'; 
import { es } from 'date-fns/locale';       
import 'react-day-picker/dist/style.css'
import './calendar.css' 

export default function Step2({ stepStatus, formData, errors, handleChange, onNext, onBack }) {
  
  const [fechasReservadas, setFechasReservadas] = useState([]);

  useEffect(() => {
    // --- DATOS SIMULADOS (PARA PRUEBAS) ---
    // Reemplaza esto con tu fetch real cuando estés listo
    const dataSimulada = ["2025-11-20", "2025-11-25", "2025-12-01"];
    const reservadas = dataSimulada.map(dateString => new Date(dateString.replace(/-/g, '/')));
    setFechasReservadas(reservadas);
  }, []); 

  const selectedDate = formData.date ? new Date(formData.date.replace(/-/g, '/')) : undefined;

  const handleDateChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      handleChange({ target: { name: 'date', value: dateString } });
    } else {
      handleChange({ target: { name: 'date', value: '' } });
    }
  };
  
  return (
    <div className={`contact-form form-step ${stepStatus}`}>
      <div className="form-header">
        <h3>Seleccioná la fecha</h3>
        <p>Paso 2/4</p>
      </div>
      <div className="formInputContainer">
        
        <div className="form-group honeypot-field" aria-hidden="true">
            <input 
              type="text" 
              name="honeypot" 
              value={formData.honeypot} 
              onChange={handleChange} 
              tabIndex="-1" 
              autoComplete="off"
            />
        </div>

        <div className="form-group-calendar">
          <DayPicker
            captionLayout="label"
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            
            disabled={[
              { before: new Date() },
              ...fechasReservadas     
            ]} 
            
            fromDate={new Date()} 
            locale={es} 
          />
          <p className="error-text">{errors.date || ''}</p>
        </div>
      </div>
      <div className="form-navigation space-between">
        <button type="button" onClick={onBack} className="secondary-btn">Volver</button>
        <button type="button" onClick={onNext} className="submit-btn">Siguiente</button>
      </div>
    </div>
  );
}