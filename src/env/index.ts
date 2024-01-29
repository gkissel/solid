import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  //   DB_HOST: z.string().default('localhost'),
  //   DB_PORT: z.string().default('5432'),
  //   DB_USER: z.string().default('postgres'),
  //   DB_PASSWORD: z.string().default('postgres'),
  //   DB_NAME: z.string().default('postgres'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error(_env.error.message)
}

export const env = _env.data
