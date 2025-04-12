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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
