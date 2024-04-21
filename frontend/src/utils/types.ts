export interface UserType {
  _id: string;
  username: string;
  password: string;
  events: EventType[];
  toDos: ToDoType[];
}

export interface InputField {
  name: string;
  label: string;
  inputType: string;
  value: string;
  setValue: (value: string) => void;
}

export interface CheckboxField {
  name: string;
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserType;
  token?: string;
}

export interface UserResult {
  success: boolean;
  message: string;
}

export interface ToDoFormData {
  title: string;
  urgency: string;
  color: string;
}

export interface ToDoType extends ToDoFormData {
  _id: string;
}

export interface EventFormData {
  description: string;
  allDay: boolean;
  start: string;
  end: string;
}

export interface EventType {
  _id: string;
  description: string;
  allDay: boolean;
  start: string;
  end: string;
}

export interface EventStyleType {
  style: {
    backgroundColor: string | undefined;
    borderColor: string | undefined;
  };
}

export interface CurrentDayType {
  currentMonth: boolean;
  date: Date;
  month: number;
  number: number;
  selected: boolean;
  year: number;
}
