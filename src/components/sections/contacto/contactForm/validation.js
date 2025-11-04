// Valida solo los campos del Paso 1
export function validateStep1(formData) {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
  
  // Validación de DNI
  const dniRegex = /^[0-9]+$/; 
  if (!dniRegex.test(formData.dni.trim())) {
    // Esto se dispara si está vacío o si contiene letras/símbolos.
    errors.dni = 'El DNI no es válido.';
  }

  // Validación de Email
  if (!formData.email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'El formato del email no es válido.';
  }

  // Validación de Teléfono
  if (!formData.phone.trim()) errors.phone = 'El teléfono es obligatorio.';
  
  return errors;
}

// Nueva función para validar solo el Paso 2
export function validateStep2(formData) {
  const errors = {};
  if (!formData.date.trim()) errors.date = 'La fecha es obligatoria.';
  return errors;
}

// Valida todo antes del envío final
export function validateAllData(formData) {
  // Combinamos los errores de los pasos 1 y 2
  const errors = {
    ...validateStep1(formData),
    ...validateStep2(formData)
  };
  
  // Validación de Invitados (Paso 3, por ejemplo)
  if (formData.guestCount && Number(formData.guestCount) <= 0) {
    errors.guestCount = 'La cantidad debe ser un número mayor a 0.';
  }
  return errors;
}