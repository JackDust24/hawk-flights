'use server';

import { FlightsResponse } from '@/app/lib/types';
import { getApiUrl } from '@/utils/api';
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

export type SearchFlightsResponse = {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  searchResult?: FlightsResponse;
};

export async function searchFlight(
  prevState: any,
  formData: FormData
): Promise<SearchFlightsResponse> {
  const formResults = addSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (formResults.success === false) {
    return {
      success: false,
      message: 'Form validation failed',
      fieldErrors: formResults.error.formErrors.fieldErrors,
    };
  }

  try {
    const flightDate = new Date(formData.get('flightDate') as string);
    const returnDate = new Date(formData.get('returnDate') as string);

    const query = new URLSearchParams({
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      flightDate: flightDate.toISOString().split('T')[0],
      returnDate: returnDate.toISOString().split('T')[0],
    }).toString();

    const response = await fetch(`${getApiUrl()}/api/flights?${query}`, {
      method: 'GET',
    });

    const result = await response.json();

    return {
      success: true,
      message: 'Search Results found',
      searchResult: result,
    };
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return {
      success: false,
      message: 'Error fetching flight data:.',
    };
  }
}
