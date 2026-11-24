import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'İstifadəçi adı və ya e-poçt mütləqdir' }),
  password: z
    .string()
    .min(1, { message: 'Şifrə mütləqdir' }),
})

export type LoginFields = z.infer<typeof loginSchema>
