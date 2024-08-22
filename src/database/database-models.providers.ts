import { Connection } from 'mongoose';
import {
  DATABASE_CONNECTION,
  USER_MODEL
} from './database.constants';
import { createUserModel } from './user.model';

export const databaseModelsProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => createUserModel(connection),
    inject: [DATABASE_CONNECTION],
  },
];
