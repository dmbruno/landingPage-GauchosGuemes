// src/components/ContactForm/validation.js

export function validateStep1(formData) {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (!formData.dni.trim()) errors.dni = 'El DNI es obligatorio.';
  if (!formData.email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'El formato del email no es válido.';
  }
  if (!formData.phone.trim()) errors.phone = 'El teléfono es obligatorio.';
  if (!formData.date.trim()) errors.date = 'La fecha es obligatoria.';
  return errors;
}

export function validateAllData(formData) {
  const errors = validateStep1(formData);
  if (formData.guestCount && Number(formData.guestCount) <= 0) {
    errors.guestCount = 'La cantidad debe ser un número mayor a 0.';
  }
  return errors;
}