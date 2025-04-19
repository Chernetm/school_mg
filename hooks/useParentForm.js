import { useState } from "react";

const initialForm = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
};

export default function useParentForm(initial = initialForm) {
  const [formData, setFormData] = useState(initial);
  const [message, setMessage] = useState("");
  
  const handleChange = (e) => {
    let { name, value } = e.target;
  
    // Capitalize unless field is email or username
    if (!name.toLowerCase().includes("email") && !name.toLowerCase().includes("username")) {
      value = value.toUpperCase();
    }
  
    setFormData({ ...formData, [name]: value });
  };
  

  const resetForm = () => setFormData(initial);

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
    message,
    setMessage,
  };
}
