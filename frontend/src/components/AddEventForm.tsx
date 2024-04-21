import { SyntheticEvent, useState } from 'react';
import moment from 'moment';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';

interface AddEventFormProps {
  addEvent: (
    description: string,
    allDay: boolean,
    start: string,
    end: string
  ) => void;
}

const AddEventForm = ({ addEvent }: AddEventFormProps) => {
  const [description, setDescription] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [start, setStart] = useState(moment().format('yyyy-MM-DD'));
  const [end, setEnd] = useState(moment().format('yyyy-MM-DD'));

  const handleAddEvent = (e: SyntheticEvent) => {
    e.preventDefault();

    if (description !== '' && start && end) {
      addEvent(description, allDay, start, end);
    }
  };
  return (
    <form className="form event-form" onSubmit={handleAddEvent}>
      <FormInput
        field={{
          name: 'event-description-input',
          label: 'Description',
          inputType: 'text',
          value: description,
          setValue: setDescription,
        }}
      />
      <FormCheckbox
        field={{
          name: 'event-allDay-input',
          label: 'All Day?',
          value: allDay,
          setValue: setAllDay,
        }}
      />
      <FormInput
        field={{
          name: 'event-start-input',
          label: 'Start',
          inputType: 'date',
          value: start,
          setValue: setStart,
        }}
      />
      <FormInput
        field={{
          name: 'event-end-input',
          label: 'End',
          inputType: 'date',
          value: end,
          setValue: setEnd,
        }}
      />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEventForm;
