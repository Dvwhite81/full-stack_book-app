import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ReqType extends Request {
  user: any;
  token: any;
}

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export interface UserType {
  _id: string;
  username: string;
  password: string;
  events: EventType[];
}

export interface EventType {
  description: string;
  allDay: boolean;
  start: Date;
  end: Date;
}

export interface ToDoType {
  title: string;
  color: string;
  urgency: string;
}
