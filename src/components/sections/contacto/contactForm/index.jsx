// src/components/ContactForm/index.jsx

// 1. Importamos 'useEffect' de React
import React, { useState, useEffect } from 'react';
import { useFormState } from './useFormState';
import { validateStep1, validateStep2, validateAllData } from './validation'; 
import './contactForm.css';

// Importamos los componentes de cada paso
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import SuccessStep from './steps/SuccessStep';


export default function ContactForm() {
  const [status, setStatus] = useState('Enviar solicitud');

  const { 
    step, 
    formData, 
    errors, 
    setErrors, 
    handleChange, 
    nextStep, 
    prevStep,
    clearStoredForm,
    acceptedTerms,
    handleTermsChange,
    formError,
    setFormError
  } = useFormState();

  // 3. AQUÍ ESTÁ LA NUEVA LÓGICA DE SCROLL
  useEffect(() => {
    // Buscamos el ID de la sección contenedora de Astro
    const formSection = document.getElementById('contacto'); 
    
    if (formSection) {
      // Le decimos al navegador que scrollee suavemente a la parte superior de esa sección
      formSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // 'start' asegura que scrollee a la parte de arriba
      });
    }
  }, [step]); // Esto se ejecuta CADA VEZ que el 'step' cambia


  
  const handleStep1Next = () => {
    const validationErrors = validateStep1(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    }
  };
  
  const handleStep2Next = () => {
    const validationErrors = validateStep2(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    }
  };

  // 4. Este es el handleSubmit ORIGINAL (con la simulación)
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // 1. Validación Honeypot (para bots)
    if (formData.honeypot) {
      console.warn("Detección de Bot (Honeypot). Envío bloqueado.");
      setStatus('¡Enviado!');
      nextStep();
      return; 
    }
    
    // 2. Validación de Términos (Paso 4)
    if (!acceptedTerms) {
      alert("Debes aceptar la política de privacidad y los términos para continuar.");
      return;
    }
    
    // 3. Validación de todos los campos (Paso 1, 2, 3)
    const validationErrors = validateAllData(formData);
    setErrors(validationErrors);

    // 4. Si todas las validaciones pasan, se inicia el envío
    if (Object.keys(validationErrors).length === 0) {
      setStatus('Enviando...');
      setFormError('');

      try {
        // --- Lógica de división de nombre ---
        // Se ejecuta antes de armar el primer payload
        const fullText = formData.name.trim();
        const parts = fullText.split(' ');
        const firstName = parts[0] || '';
        // Asume que el backend tiene last_name como nullable=True
        const lastName = parts.slice(1).join(' ') || '';
        // --- Fin de la lógica ---

        
        // --- PASO A: POST 1 - Crear el Cliente ---
        const clientPayload = {
          first_name: firstName,
          last_name: lastName, 
          email: formData.email,
          dni: formData.dni,
          phone: formData.phone,
          accepted_terms: acceptedTerms // Se envía con los datos del cliente
        };

        // Asegúrate de que esta URL sea correcta
        const clientResponse = await fetch('https://gauchos-backend.onrender.com/api/clients', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientPayload)
        });

        // Si el primer POST falla, nos detenemos aquí
        if (!clientResponse.ok) {
          const errorData = await clientResponse.json();
          throw new Error(errorData.error || 'No se pudo registrar tus datos.');
        }

        // Obtenemos el ID del cliente recién creado
        const newClient = await clientResponse.json();
        const newClientId = newClient.id; 

        if (!newClientId) {
          throw new Error('El backend no devolvió un ID de cliente válido.');
        }

        
        // --- PASO B: POST 2 - Crear la Solicitud de Reserva ---
        
        // !! IMPORTANTE: Reemplaza '1' con el ID del salón que te dio el backend.
        const VENUE_ID_FIJO = 1; 

        const bookingPayload = {
          client_id: newClientId,  // ID obtenido del Paso A
          venue_id: VENUE_ID_FIJO, // ID Fijo del salón
          
          date: formData.date, // Dato del Paso 2 del form
          // Datos opcionales del Paso 3 del form
          guests_count: parseInt(formData.guestCount, 10),
          event_type: formData.eventType,
        };

        // Asegúrate de que esta URL sea correcta
        const bookingResponse = await fetch('https://gauchos-backend.onrender.com/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingPayload)
        });

        // Si el segundo POST falla
        if (!bookingResponse.ok) {
          const errorData = await bookingResponse.json();
          // Nota: El cliente se creó, pero la reserva falló.
          throw new Error(errorData.error || 'Se registraron tus datos, pero falló la reserva de fecha.');
        }

        // --- ÉXITO TOTAL (Ambos POST funcionaron) ---
        setStatus('¡Enviado!');
        clearStoredForm(); // Limpia los datos de sesión
        nextStep(); // Avanza al paso de éxito

      } catch (error) {
        // --- MANEJO DE CUALQUIER ERROR (Paso A o B) ---
        console.error('Error en el envío de dos pasos:', error);
        setStatus('Reintentar');
        // Muestra el error específico al usuario en la pantalla de éxito/error
        setFormError(error.message || 'No pudimos enviar tu solicitud. Intenta de nuevo.');
        nextStep(); // Avanza al paso final para mostrar el error
      }
    }
  };

  const getStepStatus = (currentStepNumber) => {
    if (currentStepNumber === step) return 'active';
    if (currentStepNumber < step) return 'prev';
    if (currentStepNumber > step) return 'next';
    return '';
  };


  return (
    <form onSubmit={handleSubmit} className="contact-form-slider">
      <div className="form-steps-container">
        
        <Step1 
          stepStatus={getStepStatus(1)}
          formData={formData} 
          errors={errors} 
          handleChange={handleChange} 
          onNext={handleStep1Next} 
        />
        <Step2 
          stepStatus={getStepStatus(2)}
          formData={formData} 
          errors={errors} 
          handleChange={handleChange} 
          onNext={handleStep2Next}
          onBack={prevStep} 
        />
        <Step3 
          stepStatus={getStepStatus(3)}
          formData={formData} 
          errors={errors} 
          handleChange={handleChange} 
          onNext={nextStep}
          onBack={prevStep} 
        />
        <Step4
          stepStatus={getStepStatus(4)}
          formData={formData} 
          acceptedTerms={acceptedTerms} 
          handleTermsChange={handleTermsChange} 
          onBack={prevStep} 
          status={status} 
        />
        <SuccessStep 
          stepStatus={getStepStatus(5)}
          formError={formError} 
          onMount={clearStoredForm} 
        />
      </div>
    </form>
  );
}