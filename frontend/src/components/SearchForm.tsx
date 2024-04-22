import { SyntheticEvent, useState } from 'react';
import FormInput from './FormInput';

interface SearchFormProps {
  handleSearch: (value: string) => void;
}

const SearchForm = ({ handleSearch }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const field = {
    name: 'search',
    label: 'Search',
    inputType: 'text',
    value: searchTerm,
    setValue: setSearchTerm,
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput field={field} />
    </form>
  );
};

export default SearchForm;
