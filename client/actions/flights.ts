'use server';

import { z } from 'zod';

const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

const addSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  //   startDate: z.string().min(1),
  //   endDate: z.string().min(1),
  startDate: z.string().regex(datePattern, {
    message: 'Invalid date format, should be dd/mm/yyyy',
  }),
  endDate: z.string().regex(datePattern, {
    message: 'Invalid date format, should be dd/mm/yyyy',
  }),
});

export async function searchFlight(prevState: any, formData: FormData) {
  const formResults = addSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (formResults.success === false) {
    return formResults.error.formErrors.fieldErrors;
  }

  try {
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);

    const query = new URLSearchParams({
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      startDate: `${startDate}`,
      endDate: `${endDate}`,
    }).toString();

    const response = await fetch(`http://localhost:8080/api/flights?${query}`, {
      method: 'GET',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return error;
  }
}
