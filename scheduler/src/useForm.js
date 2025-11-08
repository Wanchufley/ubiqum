import { useState } from "react";

export const useForm = (validate, onSubmit) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    for (const key in values) {
      const error = validate(key, values[key]);
      if (error) validationErrors[key] = error;
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return [values, errors, handleChange, handleSubmit];
};

