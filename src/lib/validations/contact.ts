import { z } from 'zod';

/**
 * Contact form Zod validation schema.
 *
 * Field constraints:
 * - name: 2–100 characters
 * - email: max 254 characters, valid email format
 * - subject: 3–150 characters
 * - message: 10–1000 characters
 *
 * @see Requirements 10.1, 10.3
 */
export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().max(254).email(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(1000),
});

export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;
