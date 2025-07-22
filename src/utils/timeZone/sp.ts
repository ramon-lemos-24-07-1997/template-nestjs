import { subHours } from 'date-fns'


const now = (date?: Date): Date => {
  return subHours(date ?? new Date(), 3);
};

export default now;