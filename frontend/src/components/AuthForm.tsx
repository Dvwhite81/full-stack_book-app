import { SyntheticEvent } from 'react';
import { InputField } from '../utils/types';
import { Link } from 'react-router-dom';
import FormInput from './FormInput';

interface AuthFormProps {
  formType: string;
  fields: InputField[];
  handleSubmit: (e: SyntheticEvent) => void;
}

const AuthForm = ({ formType, fields, handleSubmit }: AuthFormProps) => {
  const btnText = formType === 'login' ? 'Log In' : 'Sign Up';

  const pText =
    formType === 'login'
      ? "Don't have an account?"
      : 'Already have an account?';

  const linkPath = formType === 'login' ? '/register' : '/login';

  const linkText = formType === 'login' ? 'Sign Up' : 'Log In';

  return (
    <form className="form auth-form" onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <FormInput key={index} field={field} />
      ))}
      <button type="submit">{btnText}</button>
      <p>
        {pText} <Link to={linkPath}>{linkText}</Link>
      </p>
    </form>
  );
};

export default AuthForm;
