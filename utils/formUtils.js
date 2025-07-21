// utils/formUtils.js
export const sanitizeInput = (value) => {
    return value.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  
  export const validateForm = (formData) => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) return `${key} is required.`;
    }
  
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Invalid email format.";
    }
  
    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone)) {
      return "Invalid phone number.";
    }
  
    return null;
  };
  