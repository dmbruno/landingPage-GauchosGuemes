// src/components/ContactForm/steps/Step2.jsx
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker'; 
import { es } from 'date-fns/locale';       
import 'react-day-picker/dist/style.css'
import './calendar.css' 

export default function Step2({ stepStatus, formData, errors, handleChange, onNext, onBack }) {
  
  const [fechasReservadas, setFechasReservadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Para saber si estamos cargando
  const [fetchError, setFetchError] = useState(null); // Para guardar un posible error


  useEffect(() => {
    // Definimos una función asíncrona dentro del effect
    const fetchFechasReservadas = async () => {
      try {
        // Asumiendo que tu endpoint se llama '/api/reservas'
        // ¡Reemplaza esto con la URL de tu API real!
        const response = await fetch('https://gauchos-backend.onrender.com/api/bookings/reserved-dates'); 

        if (!response.ok) {
          throw new Error('La respuesta del servidor no fue exitosa.');
        }

        // El backend debería devolver un array de strings: ["2025-11-20", "2025-11-25", ...]
        const data = await response.json(); 

        // Tu lógica para procesar las fechas es correcta, la reutilizamos
        const reservadas = data.map(dateString => new Date(dateString.replace(/-/g, '/')));
        
        setFechasReservadas(reservadas);

      } catch (error) {
        console.error("Error al traer las fechas:", error);
        setFetchError('No pudimos cargar las fechas disponibles. Por favor, intenta de nuevo.');
      
      } finally {
        // Haya funcionado o no, dejamos de cargar
        setIsLoading(false);
      }
    };

    // Llamamos a la función
    fetchFechasReservadas();
    
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
          
          {/* Si está cargando, muestra esto */}
          {isLoading && <p>Cargando fechas disponibles...</p>}

          {/* Si hubo un error, muestra esto */}
          {fetchError && <p className="error-text">{fetchError}</p>}

          {/* Si NO está cargando Y NO hubo error, muestra el calendario */}
          {!isLoading && !fetchError && (
            <DayPicker
              captionLayout="label"
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              
              disabled={[
                { before: new Date() }, // Esto ya deshabilita los días pasados
                ...fechasReservadas     // Esto deshabilita los días de tu API
              ]} 
              
              locale={es} 
            />
          )}
          
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





  // useEffect(() => {
  //   // --- DATOS SIMULADOS (PARA PRUEBAS) ---
  //   // Reemplaza esto con tu fetch real cuando estés listo
  //   const dataSimulada = ["2025-11-20", "2025-11-25", "2025-12-01"];
  //   const reservadas = dataSimulada.map(dateString => new Date(dateString.replace(/-/g, '/')));
  //   setFechasReservadas(reservadas);
  // }, []); 