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

// --- CAMBIO 1: LEEMOS LA CLAVE PÚBLICA DEL .ENV ---
const RECAPTCHA_SITE_KEY = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;


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

  // (El useEffect de scroll NO CAMBIA)
  useEffect(() => {
    const formSection = document.getElementById('contacto'); 
    if (formSection) {
      formSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [step]);


  // (Los handleStep1Next y handleStep2Next NO CAMBIAN)
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

  // --- CAMBIO 2: REEMPLAZA TU HANDLESUBMIT CON ESTE ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // 1. Validaciones locales (sin cambios)
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

    if (Object.keys(validationErrors).length !== 0) {
      return; // Detiene si hay errores locales
    }

    // 2. Iniciar envío y reCAPTCHA
    setStatus('Verificando...');
    setFormError('');

    // 3. Usamos grecaptcha (cargado desde el Layout)
    grecaptcha.ready(function() {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'submit_form'}).then(async function(token) {

        setStatus('Enviando...');

        // 4. Preparamos UN payload para nuestro backend de Astro
        const payload = {
          formData: formData, 
          acceptedTerms: acceptedTerms,
          recaptcha_token: token 
        };

        try {
          // 5. Hacemos UN fetch a nuestro backend de Astro
          const response = await fetch('/api/enviar-formulario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            // Si el backend de Astro (o el de Python) falló
            throw new Error(data.message || 'Error en el envío.');
          }

          // --- ÉXITO TOTAL ---
          setStatus('¡Enviado!');
          clearStoredForm(); 
          nextStep(); // Avanza al paso de éxito

        } catch (error) {
          // --- MANEJO DE CUALQUIER ERROR ---
          console.error('Error en handleSubmit:', error);
          setStatus('Reintentar');
          setFormError(error.message || 'No pudimos enviar tu solicitud.');
          nextStep(); // Avanza al paso final para mostrar el error
        }

      }); // fin .then() grecaptcha
    }); // fin .ready() grecaptcha
  };

  // (Tu getStepStatus NO CAMBIA)
  const getStepStatus = (currentStepNumber) => {
    if (currentStepNumber === step) return 'active';
    if (currentStepNumber < step) return 'prev';
    if (currentStepNumber > step) return 'next';
    return '';
  };


  // (Tu return JSX NO CAMBIA)
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