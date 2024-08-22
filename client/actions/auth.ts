'use server';

import { z } from 'zod';

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      return { success: true, message: 'Register successful' };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Registration failed.',
      };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
