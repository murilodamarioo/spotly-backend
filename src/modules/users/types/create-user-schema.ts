import z from 'zod'

export const createUserBodySchema = z.object({
  name: z.string().trim(),
  email: z.email({ pattern: z.regexes.html5Email }),
  password: z.string().trim(),
  bio: z.string().optional()
})

export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>