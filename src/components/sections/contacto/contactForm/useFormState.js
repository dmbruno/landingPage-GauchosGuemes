// src/components/ContactForm/useFormState.js

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'contactFormSessionData';

const loadInitialState = () => {
  try {
    const storedItem = sessionStorage.getItem(STORAGE_KEY);
    return storedItem ? JSON.parse(storedItem) : {
      name: '', email: '', dni: '', phone: '', date: '',
      eventType: '', guestCount: '', services: '',
    };
  } catch (error) {
    console.error("Error al leer desde sessionStorage", error);
    return { name: '', email: '', dni: '', phone: '', date: '', eventType: '', guestCount: '', services: '' };
  }
};

export function useFormState() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(loadInitialState);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // 1. AÑADIMOS EL NUEVO ESTADO DE DIRECCIÓN
  const [direction, setDirection] = useState('next'); 

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
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

  // 2. ACTUALIZAMOS LAS FUNCIONES DE NAVEGACIÓN
  const nextStep = () => {
    setDirection('next'); // Le decimos que vamos hacia adelante
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setDirection('prev'); // Le decimos que vamos hacia atrás
    setStep((prev) => prev - 1);
  };

  const clearStoredForm = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // 3. EXPORTAMOS EL NUEVO ESTADO
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
    direction, // <-- Exportamos la dirección
  };
}