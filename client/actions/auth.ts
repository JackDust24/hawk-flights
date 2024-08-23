'use server';

import { z } from 'zod';
import axios from 'axios';

const registrationSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type RegisterUserResponse = {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerUser(
  prevState: any,
  formData: FormData
): Promise<RegisterUserResponse> {
  const formObject = Object.fromEntries(formData.entries());

  const formResults = registrationSchema.safeParse(
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
    const data = {
      ...formObject,
      role: formObject.role || 'member',
    };

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/register`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return { success: true, message: 'Register successful' };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || 'Registration failed.',
        };
      } else if (error.request) {
        return { success: false, message: 'No response from server' };
      } else {
        return {
          success: false,
          message: 'Error occurred while setting up request',
        };
      }
    } else {
      return { success: false, message: 'An unknown error occurred' };
    }
  }
}
