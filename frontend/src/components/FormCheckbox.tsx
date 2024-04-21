import { CheckboxField } from '../utils/types';

interface FormCheckboxProps {
  field: CheckboxField;
}

const FormCheckbox = ({ field }: FormCheckboxProps) => {
  const { name, label, value, setValue } = field;

  const handleChange = () => {
    const newValue = !value;
    setValue(newValue);
  };

  return (
    <div className="form-input form-checkbox">
      <label htmlFor={name}>
        {label}
        <input
          id={name}
          type="checkbox"
          checked={value === true}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default FormCheckbox;
