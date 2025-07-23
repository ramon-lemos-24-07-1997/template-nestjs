// src/common/helpers/date.helper.ts
import { subHours } from 'date-fns';


export const now = (date?: Date): Date => {
  return subHours(date ?? new Date(), 3);
};

