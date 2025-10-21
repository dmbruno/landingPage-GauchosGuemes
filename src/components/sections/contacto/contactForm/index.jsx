// src/components/ContactForm/index.jsx

import React, { useState } from 'react';
import { useFormState } from './useFormState';
import { validateStep1, validateAllData } from './validation';
import './contactForm.css';

// Importamos los componentes de cada paso
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import SuccessStep from './steps/SuccessStep';

export default function ContactForm() {
  const [status, setStatus] = useState('Enviar solicitud');

  // Obtenemos todos los estados y funciones del hook
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
    direction,
    formError,
    setFormError
  } = useFormState();

  const handleStep1Next = () => {
    const validationErrors = validateStep1(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!acceptedTerms) {
      alert("Debes aceptar la política de privacidad y los términos para continuar.");
      return;
    }
    const validationErrors = validateAllData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setStatus('Enviando...');
      setFormError(''); // Limpiamos errores anteriores
      
      try {
        // --- AQUÍ VA TU LÓGICA DE ENVÍO REAL ---
        // Reemplaza esto con tu 'fetch' a tu API/backend
        const response = await new Promise((resolve, reject) => {
          // --- Simulación de ÉXITO (comenta la línea de error para usar esta) ---
          setTimeout(() => resolve({ ok: true }), 1500);

          // --- Simulación de ERROR (descomenta esta línea para probar el error) ---
          // setTimeout(() => reject(new Error('Fallo simulado del servidor')), 1500);
        });

        if (!response.ok) {
          throw new Error('El servidor no pudo procesar la solicitud.');
        }

        // --- ÉXITO ---
        setStatus('¡Enviado!');
        clearStoredForm(); // Limpia solo en caso de éxito
        nextStep();

      } catch (error) {
        // --- MANEJO DEL ERROR ---
        console.error('Error al enviar el formulario:', error);
        setStatus('Reintentar'); // Cambiamos el texto del botón
        setFormError('No pudimos enviar tu solicitud. Por favor, intentá de nuevo o comunicate por WhatsApp.');
        nextStep(); // Llevamos al usuario al "paso 4" (que ahora es éxito O error)
      }
    }
  };

  // Lógica para asignar el estado a cada paso
  const getStepStatus = (currentStepNumber) => {
    if (currentStepNumber === step) return 'active';
    if (currentStepNumber < step) return 'prev'; // Es un paso "pasado"
    if (currentStepNumber > step) return 'next'; // Es un paso "futuro"
    return '';
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form-slider">
      <div className="form-steps-container">
        
        {/* Pasamos 'stepStatus' en lugar de 'isActive' */}
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
          onNext={nextStep} 
          onBack={prevStep} 
        />
        <Step3 
          stepStatus={getStepStatus(3)}
          formData={formData} 
          acceptedTerms={acceptedTerms} 
          handleTermsChange={handleTermsChange} 
          onBack={prevStep} 
          status={status} 
        />
        <SuccessStep 
          stepStatus={getStepStatus(4)}
          formError={formError} // Pasamos el error
          onMount={clearStoredForm} 
        />
      </div>
    </form>
  );
}