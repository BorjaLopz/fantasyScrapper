import { z } from 'zod';

const getBodySchema = () => {
  const bodySchema = z.object({
    username: z
      .string({ required_error: 'Username is required.' })
      .trim()
      .toLowerCase()
      .min(1, { message: 'Username is required.' })
      .max(255, { message: 'Username is too long.' }),
    password: z
      .string({ required_error: 'Password is required.' })
      .trim()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(128, { message: 'Password is too long.' }),
  });

  return bodySchema;
};

export const loginSchema = z.object({
  body: getBodySchema(),
});
