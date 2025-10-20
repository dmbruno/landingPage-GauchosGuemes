
import React, { useState } from 'react'; // Agregamos useState aquí
import { useFormState } from './useFormState';
import { validateStep1, validateAllData } from './validation';
import './ContactForm.css';

// Importamos los componentes de cada paso
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import SuccessStep from './steps/SuccessStep';

export default function ContactForm() {
  const [status, setStatus] = useState('Enviar solicitud');

  // Nos aseguramos de extraer TODAS las funciones y variables que necesitamos del hook.
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
    handleTermsChange
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
      // Lógica de envío...
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('¡Enviado!');
      nextStep();
    }
  };

  switch (step) {
    case 1:
      return <Step1 formData={formData} errors={errors} handleChange={handleChange} onNext={handleStep1Next} />;
    case 2:
      return <Step2 formData={formData} errors={errors} handleChange={handleChange} onNext={nextStep} onBack={prevStep} />;
    case 3:
      return <Step3 formData={formData} acceptedTerms={acceptedTerms} handleTermsChange={handleTermsChange} onSubmit={handleSubmit} onBack={prevStep} status={status} />;
    case 4:
      return <SuccessStep onMount={clearStoredForm} />;
    default:
      return null;
  }
}