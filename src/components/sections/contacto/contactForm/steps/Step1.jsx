
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






  //const [fechasReservadas, setFechasReservadas] = useState([]);

  //useEffect(() => {
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
    //const dataSimulada = ["2025-11-20", "2025-11-25", "2025-12-01"];
    //const reservadas = dataSimulada.map(dateString => new Date(dateString.replace(/-/g, '/')));
    //setFechasReservadas(reservadas);
    // --- Fin de la simulación ---
    

  //}, []); // El array vacío asegura que se ejecute solo una vez