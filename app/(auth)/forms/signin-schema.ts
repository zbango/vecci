import { z } from 'zod';

export const getSigninSchema = () => {
  return z.object({
    email: z
      .string()
      .email({ message: 'Por favor ingresa una dirección de correo válida.' })
      .min(1, { message: 'Correo electrónico es requerido.' }),
    password: z.string().min(1, { message: 'Contraseña es requerida.' }),
    rememberMe: z.boolean().optional(),
  });
};

export type SigninSchemaType = z.infer<ReturnType<typeof getSigninSchema>>;
