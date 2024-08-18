'use server';

import { z } from 'zod';

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Must be YYYY-MM-DD');

const textWithoutNumbersSchema = z
  .string()
  .min(1, 'This field is required')
  .regex(/^[a-zA-Z\s]+$/, 'Only alphabetic characters and spaces are allowed');

const addSchema = z.object({
  origin: textWithoutNumbersSchema,
  destination: textWithoutNumbersSchema,
  flightDate: dateSchema,
  returnDate: dateSchema,
});

export async function searchFlight(prevState: any, formData: FormData) {
  const formResults = addSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (formResults.success === false) {
    return formResults.error.formErrors.fieldErrors;
  }

  try {
    const flightDate = new Date(formData.get('flightDate') as string);
    const returnDate = new Date(formData.get('returnDate') as string);

    console.log('Flight date:', flightDate);
    console.log('returnDate', returnDate);

    const query = new URLSearchParams({
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      flightDate: flightDate.toISOString().split('T')[0],
      returnDate: returnDate.toISOString().split('T')[0],
    }).toString();

    const response = await fetch(`http://localhost:8080/api/flights?${query}`, {
      method: 'GET',
    });

    const result = await response.json();
    console.log('Flight data:', result);
    return result;
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return error;
  }
}
