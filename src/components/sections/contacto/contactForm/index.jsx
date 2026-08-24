// src/components/ContactForm/index.jsx


import { useState, useEffect, useRef } from 'react';
import { useFormState } from './useFormState';
import { validateStep1, validateStep2, validateAllData } from './validation';
import { buildWhatsappLink } from './whatsapp';
import './contactForm.css';

// Importamos los componentes de cada paso
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import SuccessStep from './steps/SuccessStep';

export default function ContactForm() {
  const [whatsappLink, setWhatsappLink] = useState('');

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
  } = useFormState();

  const esPrimerMontaje = useRef(true);

  useEffect(() => {

    if (esPrimerMontaje.current) {
      esPrimerMontaje.current = false;
      return; // Salimos del useEffect
    }
    const formSection = document.getElementById('contacto'); 
    if (formSection) {
      formSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [step]);



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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Honeypot: si un bot completó el campo oculto, simulamos éxito y cortamos acá.
    if (formData.honeypot) {
      console.warn("Detección de Bot (Honeypot). Envío bloqueado.");
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

    // Abrimos WhatsApp con los datos precargados. Se hace de forma síncrona,
    // dentro del mismo click, para que el navegador no lo bloquee como pop-up.
    const link = buildWhatsappLink(formData);
    window.open(link, '_blank', 'noopener,noreferrer');

    setWhatsappLink(link);
    clearStoredForm();
    nextStep();
  };

  // (getStepStatus)
  const getStepStatus = (currentStepNumber) => {
    if (currentStepNumber === step) return 'active';
    if (currentStepNumber < step) return 'prev';
    if (currentStepNumber > step) return 'next';
    return '';
  };


  // (return JSX)
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
        />
        <SuccessStep
          stepStatus={getStepStatus(5)}
          whatsappLink={whatsappLink}
          onMount={clearStoredForm}
        />
      </div>
    </form>
  );
}