import React, { useState } from 'react';
import { useFormState } from './useFormState';
// Asegúrate de importar las TRES funciones de validación
import { validateStep1, validateStep2, validateAllData } from './validation'; 
import './contactForm.css';

// Importamos los componentes de cada paso
import Step1 from './steps/Step1';
import Step2 from './steps/Step2'; // El nuevo paso de calendario
import Step3 from './steps/Step3'; // Antes era Step2 (Opcionales)
import Step4 from './steps/Step4'; // Antes era Step3 (Revisión)
import SuccessStep from './steps/SuccessStep'; // Ahora es el 5to paso

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
    direction,
    formError,
    setFormError
  } = useFormState();

  // --- ESTA ES LA LÓGICA CORREGIDA ---

  // Validación para el Paso 1 (Datos personales)
  const handleStep1Next = () => {
    const validationErrors = validateStep1(formData); // Valida SOLO el Paso 1
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    }
  };

  // Validación para el Paso 2 (Calendario)
  const handleStep2Next = () => {
    const validationErrors = validateStep2(formData); // Valida SOLO el Paso 2
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (formData.honeypot) {
      console.warn("Detección de Bot (Honeypot). Envío bloqueado.");
      setStatus('¡Enviado!');
      nextStep(); 
      return; 
    }
    
    if (!acceptedTerms) {
      alert("Debes aceptar la política de privacidad y los términos para continuar.");
      return;
    }
    
    // Valida TODO antes de enviar
    const validationErrors = validateAllData(formData); 
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setStatus('Enviando...');
      setFormError(''); 
      
      try {
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => resolve({ ok: true }), 1500);
          // setTimeout(() => reject(new Error('Fallo simulado del servidor')), 1500);
        });

        if (!response.ok) {
          throw new Error('El servidor no pudo procesar la solicitud.');
        }

        setStatus('¡Enviado!');
        clearStoredForm(); 
        nextStep();

      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        setStatus('Reintentar'); 
        setFormError('No pudimos enviar tu solicitud. Por favor, intentá de nuevo o comunicate por WhatsApp.');
        nextStep(); 
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
          onNext={handleStep1Next} // <--- Usa el validador del Paso 1
        />
        <Step2 
          stepStatus={getStepStatus(2)}
          formData={formData} 
          errors={errors} 
          handleChange={handleChange} 
          onNext={handleStep2Next} // <--- Usa el validador del Paso 2
          onBack={prevStep} 
        />
        <Step3 
          stepStatus={getStepStatus(3)}
          formData={formData} 
          errors={errors} 
          handleChange={handleChange} 
          onNext={nextStep} // <--- Este pasa directo, sin validar
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