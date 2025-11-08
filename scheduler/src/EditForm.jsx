import { useLocation } from "react-router-dom";
import { useForm } from "./useForm";
import { timeParts } from "./utilities/times.js";

const isValidMeets = (meets) => {
  const parts = timeParts(meets);
  return (
    meets === "" ||
    (parts.days && !isNaN(parts.hours?.start) && !isNaN(parts.hours?.end))
  );
};

const validateCourseData = (key, val) => {
  switch (key) {
    case "title":
      return /(^$|\w\w)/.test(val) ? "" : "Must be at least two characters";
    case "meets":
      return isValidMeets(val) ? "" : "Must be days hh:mm-hh:mm";
    default:
      return "";
  }
};

const submit = (values) => alert(JSON.stringify(values, null, 2));

const EditForm = () => {
  const location = useLocation();
  const course = location.state || { id: "", title: "", meets: "" };

  const [values, errors, handleChange, handleSubmit] = useForm(
    validateCourseData,
    submit
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="id" defaultValue={course.id} />

      {/* Title input */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Course title
        </label>
        <input
          name="title"
          id="title"
          className={`form-control ${errors?.title ? "is-invalid" : values.title ? "is-valid" : ""
            }`}
          defaultValue={course.title}
          onChange={handleChange}
        />
        <div className="invalid-feedback">{errors?.title}</div>
      </div>

      {/* Meets input */}
      <div className="mb-3">
        <label htmlFor="meets" className="form-label">
          Meeting time
        </label>
        <input
          name="meets"
          id="meets"
          className={`form-control ${errors?.meets ? "is-invalid" : values.meets ? "is-valid" : ""
            }`}
          defaultValue={course.meets}
          onChange={handleChange}
        />
        <div className="invalid-feedback">{errors?.meets}</div>
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default EditForm;

