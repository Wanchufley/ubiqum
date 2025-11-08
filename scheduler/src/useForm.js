import { useState } from "react";

export const useForm = (validate, onSubmit, initialValues) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: error });
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

