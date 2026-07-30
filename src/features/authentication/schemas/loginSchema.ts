import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username or email is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
})

export type LoginFields = z.infer<typeof loginSchema>
