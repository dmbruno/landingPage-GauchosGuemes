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

// 2. Quitamos toda la lógica de reCAPTCHA (wrapper, siteKey, etc.)
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


  // --- Lógica de validación de pasos (queda igual) ---
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
    
    const validationErrors = validateAllData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setStatus('Enviando...');
      setFormError('');

      try {
        // VOLVEMOS A LA SIMULACIÓN
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
        setFormError('No pudimos enviar tu solicitud. Por favor, intentá de nuevo.');
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

  // 5. El return vuelve a ser simple (sin el wrapper de reCAPTCHA)
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