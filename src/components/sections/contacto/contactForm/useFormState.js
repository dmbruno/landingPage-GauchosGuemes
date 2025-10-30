import { useState, useEffect } from 'react';

const STORAGE_KEY = 'contactFormSessionData';

const loadInitialState = () => {
  try {
    const storedItem = sessionStorage.getItem(STORAGE_KEY);
    const initialData = storedItem ? JSON.parse(storedItem) : {
      name: '', email: '', dni: '', phone: '', date: '',
      eventType: '', guestCount: '', services: '',
    };
    
    // Aseguramos que el honeypot siempre inicie vacío
    initialData.honeypot = ''; 

    return initialData;

  } catch (error) {
    console.error("Error al leer desde sessionStorage", error);
    return { 
      name: '', email: '', dni: '', phone: '', date: '', 
      eventType: '', guestCount: '', services: '', honeypot: '' 
    };
  }
};

export function useFormState() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(loadInitialState);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [direction, setDirection] = useState('next'); 
  const [formError, setFormError] = useState(''); 

  useEffect(() => {
    // No guardamos el honeypot en sessionStorage
    const { honeypot, ...dataToStore } = formData;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Error al guardar en sessionStorage", error);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const nextStep = () => {
    setDirection('next');
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setDirection('prev');
    setStep((prev) => prev - 1);
  };

  const clearStoredForm = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return {
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
    setFormError,
  };
}