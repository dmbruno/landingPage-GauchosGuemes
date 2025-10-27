// src/components/ContactForm/steps/Step1.jsx
// src/components/ContactForm/steps/Step1.jsx
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker'; 
import { es } from 'date-fns/locale';       
import 'react-day-picker/dist/style.css'
import './calendar.css'
export default function Step1({ stepStatus, formData, errors, handleChange, onNext }) {
  
  const [fechasReservadas, setFechasReservadas] = useState([]);

  useEffect(() => {
    // --- CÓDIGO CON FETCH (COMENTADO) ---
    // const fetchFechas = async () => {
    //   try {
    //     // 1. Hacés la llamada a tu API (asegurate que solo devuelva fechas futuras, que no traiga las fechas reservadas anteiores a la fecha del día que hace la consulta)
    //     const response = await fetch('/api/fechas-reservadas'); // Cambia '/api/fechas-reservadas' por tu URL real
        
    //     // 2. Verificás si la respuesta fue exitosa
    //     if (!response.ok) {
    //       throw new Error(`Error del servidor: ${response.status}`);
    //     }
        
    //     // 3. Convertís la respuesta a JSON (esperando un array de strings: ["2025-11-20", ...])
    //     const data = await response.json(); 
        
    //     // 4. Procesás las fechas asumiendo que son locales (GMT-3)
    //     const reservadas = data.map(dateString => new Date(dateString.replace(/-/g, '/')));

    //     // 5. Guardás las fechas en el estado
    //     setFechasReservadas(reservadas);

    //   } catch (err) {
    //     console.error("Error al cargar fechas desde la API:", err);
    //     // Aquí podrías mostrar un mensaje al usuario o intentar de nuevo
    //     // Por ejemplo: setErrors(prev => ({ ...prev, api: 'No se pudieron cargar las fechas.' }));
    //   }
    // };
    
    // fetchFechas(); // Ejecutás la función para traer los datos
    // // --- FIN DEL CÓDIGO CON FETCH ---

    
    // --- DATOS SIMULADOS (PARA PRUEBAS) ---
    // Comenta el bloque de fetchFechas() y descomenta esto si querés probar sin API
    const dataSimulada = ["2025-11-20", "2025-11-25", "2025-12-01"];
    const reservadas = dataSimulada.map(dateString => new Date(dateString.replace(/-/g, '/')));
    setFechasReservadas(reservadas);
    // --- Fin de la simulación ---
    

  }, []); // El array vacío asegura que se ejecute solo una vez

  // Convertimos el string del form (ej: "2025-10-30") a un objeto Date LOCAL
  const selectedDate = formData.date ? new Date(formData.date.replace(/-/g, '/')) : undefined;

  // Convertimos el objeto Date del calendario a un string "YYYY-MM-DD"
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
        <h3>Datos esenciales</h3>
        <p>Paso 1/3</p>
      </div>
      <div className="formInputContainer">
        {/* --- Tus otros inputs (nombre, DNI, etc.) --- */}
        <div className="form-group">
            <label>Tu nombre completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            <p className="error-text">{errors.name || ''}</p>
        </div>
        <div className="form-group">
            <label>DNI</label>
            <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
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
        <div className="form-group-calendar">
          <label>Fecha</label>
          <DayPicker
            captionLayout="label"
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            
            disabled={[
              { before: new Date() },
              ...fechasReservadas     
            ]} 
            
            fromDate={new Date()} // No se pueden seleccionar fechas pasadas
            locale={es} 

          />
          <p className="error-text">{errors.date || ''}</p>
        </div>
      </div>
      <div className="form-navigation">
        <button type="button" onClick={onNext} className="submit-btn">Siguiente</button>
      </div>
    </div>
  );
}